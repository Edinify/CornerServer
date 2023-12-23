import { Base } from "../model/baseModel.js";
import { Check } from "../model/checkModel.js";
import { calcDate } from "../calculate/calculateDate.js";

// Create check
export const createCheck = async (req, res) => {
  const { orders, table, sets } = req.body;
  try {
    const existsCheck = await Check.findOne({
      status: "open",
      "table._id": table._id,
    });

    if (existsCheck) {
      return res.status(409).json({ message: "exist same table open check" });
    }

    const newCheck = new Check(req.body);
    await newCheck.save();

    for (let item of orders) {
      const targetProduct = await Base.findById(item.order.product._id);

      targetProduct.totalAmount -= item.orderCount;
      await targetProduct.save();
      console.log(targetProduct, "create targetProduct");
    }

    for (let item of sets) {
      for (let productItem of item.set.products) {
        const targetProduct = await Base.findById(productItem.product._id);

        targetProduct.totalAmount -= parseFloat(
          (
            productItem.productCount *
            productItem.productUnitAmount *
            item.setCount
          ).toFixed(2)
        );

        await targetProduct.save();
      }
    }

    res.status(201).json(newCheck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get checks
export const getChecks = async (req, res) => {
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
    console.log(targetDate);

    const filterObj = {
      createdAt: {
        $gte: targetDate.startDate,
        $lte: targetDate.endDate,
      },
    };
    const checksCount = await Check.countDocuments(filterObj);

    const totalPages = Math.ceil(checksCount / limit);

    const checks = await Check.find(filterObj)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({ checks, totalPages });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get check
export const getCheck = async (req, res) => {
  const { id } = req.params;

  try {
    const check = await Check.findById(id);

    if (!check) {
      return res
        .status(404)
        .json({ key: "check-not-found", message: "check note found" });
    }
    console.log(check, "1");
    res.status(200).json(check);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update check
export const updateCheck = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const currentCheck = await Check.findById(id);
    const updatedCheck = await Check.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log(updateCheck, "updated check");

    if (!updatedCheck) {
      return res.status(404).json({ message: "check not found" });
    }

    const removedOrders = currentCheck.orders.filter(
      (item) =>
        !updatedCheck.orders.find(
          (currItem) =>
            currItem.order._id.toString() === item.order._id.toString()
        )
    );

    const removedSets = currentCheck.sets.filter(
      (item) =>
        !updatedCheck.sets.find(
          (currItem) => currItem.set._id.toString() === item.set._id.toString()
        )
    );

    for (let item of updatedCheck.orders) {
      const targetProduct = await Base.findById(item.order.product._id);
      const beforeOrderCount =
        currentCheck.orders.find(
          (currItem) =>
            currItem.order._id.toString() == item.order._id.toString()
        )?.orderCount || 0;

      const orderCount = item.orderCount - beforeOrderCount;

      targetProduct.totalAmount -= orderCount;

      await targetProduct.save();
    }

    for (let item of removedOrders) {
      const targetProduct = await Base.findById(item.order.product._id);

      targetProduct.totalAmount += item.orderCount;

      await targetProduct.save();
    }

    for (let item of updatedCheck.sets) {
      console.log(item.set);
      for (let productItem of item.set.products) {
        // set daxilindəki cari product
        const targetProduct = await Base.findById(productItem.product._id);

        console.log(targetProduct, "target product");

        console.log(currentCheck.sets, "currentcheck sets");
        console.log(productItem, "product item");

        // yenilənməmiş check-in set-ləri daxilindən cari set-in tapılması
        const targetSetItem = currentCheck.sets.find(
          (currItem) => currItem.set._id == item.set._id
        );

        console.log(targetSetItem, "target set item");

        // əvvəlki checkdən tapılan uyğun set daxilindəki cari product ilə eyni productun tapılması
        const targetProductItem = targetSetItem?.set?.products.find(
          (proItem) =>
            proItem.product._id.toString() ===
            productItem.product._id.toString()
        );

        console.log(targetProductItem, "targetProductItem");

        // əvvəlki cehckdəki uyğun productun nə qədər olduğunu tapmaq
        const beforeProductCount = parseFloat(
          (
            (targetProductItem?.productCount || 0) *
            (productItem?.productUnitAmount || 0) *
            (targetSetItem?.setCount || 0)
          ).toFixed(2)
        );

        // yeni check-dəki cari productun nə qədər olduğunu tapmaq
        const newProductCount = parseFloat(
          (
            productItem.productCount *
            productItem.productUnitAmount *
            item.setCount
          ).toFixed(2)
        );

        console.log(beforeProductCount, "beforeProductCount");
        console.log(newProductCount, "newProductCount");

        // əvvəlki cehck ilə yeni check-in fərqlərini tapıb anbardakı məhsul sayını yeniləmək
        const productCount = beforeProductCount - newProductCount;

        console.log(productCount, "productCount");

        console.log(targetProduct.totalAmount, "old totalAmount");

        targetProduct.totalAmount += parseFloat(productCount.toFixed(2));

        console.log(targetProduct.totalAmount, "new totalAmount");

        await targetProduct.save();
      }
    }

    for (let item of removedSets) {
      for (let productItem of item.set.products) {
        const targetProduct = await Base.findById(productItem.product._id);

        targetProduct.totalAmount += parseFloat(
          (
            productItem.productCount *
            productItem.productUnitAmount *
            item.setCount
          ).toFixed(2)
        );

        await targetProduct.save();
      }
    }

    if (
      currentCheck.status !== "cancelled" &&
      updatedCheck.status === "cancelled"
    ) {
      console.log("salam");

      for (let item of updatedCheck.orders) {
        const targetProduct = await Base.findById(item.order.product._id);

        targetProduct.totalAmount += item.orderCount;

        await targetProduct.save();
      }

      for (let item of updatedCheck.sets) {
        console.log(item, "update sets");

        for (let productItem of item.set.products) {
          console.log(productItem, "product item");

          const targetProduct = await Base.findById(productItem.product._id);

          targetProduct.totalAmount += parseFloat(
            (
              productItem.productCount *
              productItem.productUnitAmount *
              item.setCount
            ).toFixed(2)
          );

          await targetProduct.save();
        }
      }
    }

    res.status(200).json(updatedCheck);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete check
// export const deleteCheck = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedCheck = await Check.findByIdAndDelete(id);

//     if (!deletedCheck) {
//       return res.status(404).json({ message: "check not found" });
//     }

//     res.status(200).json(deletedCheck);
//   } catch (err) {
//     res.status(500).json({ message: { error: err.message } });
//   }
// };
