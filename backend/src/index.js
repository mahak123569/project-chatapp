import express from 'express';
import dotenv from "dotenv"

import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();


console.log("MONGODB_URL =", process.env.MONGODB_URL);



const app = express();

const PORT = process.env.PORT
app.use(express.json())

app.use("/api/auth",authRoutes)
app.listen(PORT, () => {
  console.log("Server is running on PORT:"+ PORT);
  connectDB()
});