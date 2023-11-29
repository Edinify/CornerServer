import { Admin } from "../model/adminModel.js";

export const getAdmin = async (req, res) => {
  const { _id } = req.user;
  try {
    const admin = await Admin.findById(_id).select("-password -accessToken");

    if (!admin) {
      return res
        .status(404)
        .json({ key: "admin-not-found", message: "admin not found" });
    }

    res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ message: { error: err.message } });
  }
};
