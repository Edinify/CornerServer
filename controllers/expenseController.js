import { calcDate } from "../calculate/calculateDate.js";
import { Expense } from "../model/expenseModel.js";

// Create expense
export const createExpense = async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();

    const expensesCount = await Expense.countDocuments();
    const lastPage = Math.ceil(expensesCount / 10);

    res.status(201).json({ expense: newExpense, lastPage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get expenses
export const getExpenses = async (req, res) => {
  const { startDate, endDate } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    let targetDate;
    if (startDate && endDate) {
      targetDate = calcDate(null, startDate, endDate);
    } else {
      targetDate = calcDate(1);
    }

    const filterObj = {
      date: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    };

    const expensesCount = await Expense.countDocuments(filterObj);

    const totalPages = Math.ceil(expensesCount / limit);

    const expenses = await Expense.find(filterObj)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ expenses, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(deletedExpense);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
