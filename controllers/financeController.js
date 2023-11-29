import { calcDate, calcDateWithMonthly } from "../calculate/calculateDate.js";
import { Check } from "../model/checkModel.js";
import { Expense } from "../model/expenseModel.js";

export const getFinance = async (req, res) => {
  const { monthCount, startDate, endDate } = req.query;

  try {
    let targetDate;

    if (monthCount) {
      targetDate = calcDate(monthCount);
    } else if (startDate && endDate) {
      targetDate = calcDateWithMonthly(startDate, endDate);
    }

    const checks = await Check.find({
      status: "confirmed",
      createdAt: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    });

    const expenses = await Expense.find({
      date: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    });

    const totalIncome = checks.reduce(
      (total, check) => total + check.totalPayment,
      0
    );

    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.price,
      0
    );

    const profit = totalIncome - totalExpense;

    const result = {
      income: totalIncome.toFixed(2),
      expense: totalExpense.toFixed(2),
      profit: profit.toFixed(2),
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

export const getChartData = async (req, res) => {
  const { monthCount, startDate, endDate } = req.query;

  try {
    let targetDate;

    if (monthCount) {
      targetDate = calcDate(monthCount);
    } else if (startDate && endDate) {
      targetDate = calcDateWithMonthly(startDate, endDate);
    }

    const checks = await Check.find({
      status: "confirmed",
      createdAt: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    });

    const expenses = await Expense.find({
      date: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    });

    const months = [];
    const chartIncome = [];
    const chartExpense = [];
    const chartProfit = [];

    while (targetDate.startDate <= targetDate.endDate) {
      const targetYear = targetDate.startDate.getFullYear();
      const targetMonth = targetDate.startDate.getMonth();

      const filteredChecks = checks.filter(
        (check) =>
          check.createdAt?.getMonth() === targetMonth &&
          check.createdAt?.getFullYear() === targetYear
      );

      const filteredExpenses = expenses.filter(
        (expense) =>
          expense.date?.getMonth() === targetMonth &&
          expense.date?.getFullYear() === targetYear
      );

      const totalIncome = filteredChecks.reduce(
        (total, check) => total + check.totalPayment,
        0
      );

      const totalExpense = filteredExpenses.reduce(
        (total, expense) => (total += expense.price),
        0
      );

      const profit = totalIncome - totalExpense;

      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(targetDate.startDate);

      months.push({ month: monthName, year: targetYear });
      chartIncome.push(totalIncome.toFixed(2));
      chartExpense.push(totalExpense.toFixed(2));
      chartProfit.push(profit.toFixed(2));

      targetDate.startDate.setMonth(targetDate.startDate.getMonth() + 1);
    }

    res.status(200).json({ months, chartIncome, chartExpense, chartProfit });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
