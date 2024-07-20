import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import "express-async-errors";
import connectDB from "./db/databaseConnection";
import errorHandler from "./middlerware/globalHandlerError";
import userRoutes from "./controllers/userRoutes";

const app: Application = express();
app.use(express.json());
app.use(cors());
app.use("/userRoutes", userRoutes);
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
