import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import authRoutes from "./router/authRoutes.js";
import adminRoutes from "./router/adminRoutes.js";
import userRoutes from "./router/userRoutes.js";
import baseRoutes from "./router/baseRoutes.js";
import menuRoutes from "./router/menuRoutes.js";
import categoryRoutes from "./router/categoryRoutes.js";
import tableRoutes from "./router/tableRoutes.js";
import expenseRoutes from "./router/expenseRoutes.js";
import financeRoutes from "./router/financeRoutes.js";
import checkRoutes from "./router/checkRoutes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.URL_PORT,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Content-Type"],
  })
);
// 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 
app.use("/api/auth/admin/", authRoutes);
app.use("/api/admin/", adminRoutes);
app.use("/api/user/", userRoutes);
app.use("/api/base/", baseRoutes);
app.use("/api/menu/", menuRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/table/", tableRoutes);
app.use("/api/expense/", expenseRoutes);
app.use("/api/finance/", financeRoutes);
app.use("/api/check/", checkRoutes);

app.get("/", (req, res) => {
  res.send("salam");
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("connected database");
    app.listen(process.env.PORT, async () => {
      console.log(`listen server at ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
