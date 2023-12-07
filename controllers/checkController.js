import { Base } from "../model/baseModel.js";
import { Check } from "../model/checkModel.js";

// Create check
export const createCheck = async (req, res) => {
  const { orders, table } = req.body;
  console.log(req.body, "new check");
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

    res.status(201).json(newCheck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get checks
export const getChecks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const checksCount = await Check.countDocuments();

    const totalPages = Math.ceil(checksCount / limit);

    const checks = await Check.find()
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(checks,2)
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
    console.log(check,"1")
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

    if (
      currentCheck.status !== "cancelled" &&
      updatedCheck.status === "cancelled"
    ) {
      for (let item of updatedCheck.orders) {
        const targetProduct = await Base.findById(item.order.product._id);

        targetProduct.totalAmount += item.orderCount;

        await targetProduct.save();
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
