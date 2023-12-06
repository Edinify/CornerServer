import { Admin } from "../model/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AccessCode } from "../model/accessCodeModel.js";

export const registerAdmin = async (req, res) => {
  const { password } = req.body;
  try {
    const checkAdmin = await Admin.countDocuments();

    if (checkAdmin) {
      return res.status(409).json({ message: "admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({ ...req.body, password: hashedPassword });

    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;


  try {
    const regexEmail = new RegExp(email, "i");

    const admin = await Admin.findOne({ email: { $regex: regexEmail } });

    if (!admin) {
      return res
        .status(404)
        .json({ key: "admin-not-found", message: "invalid email" });
    }

    const checkPassword = await bcrypt.compare(password, admin.password);

    if (!checkPassword) {
      return res
        .status(404)
        .json({ key: "admin-not-found", message: "invalid password" });
    }

    // console.log(process.env.SECRET_KEY);
    const accessToken = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    admin.accessToken = accessToken;
    await admin.save();

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

export const loginUser = async (req, res) => {
  const { accessCode } = req.body;

  // console.log(req.body);
  // console.log(accessCode, "access code");
  try {
    const code = await AccessCode.findOne({ accessCode: accessCode });

    if (!code) {
      return res
        .status(404)
        .json({ key: "invalid-code", message: "invalid code" });
    }

    res.status(200).json(code);
  } catch (err) {
    return res.status(500).json({ message: { error: err.message } });
  }
};
