import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // MUST trước import dbConfig
import db from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
// import userRoute from "./routes/userRoute.js";
import connectDB from "./libs/db.js";
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Coffee App backend." });
});

//pulic routes
app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});