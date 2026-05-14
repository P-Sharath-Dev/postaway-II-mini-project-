import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import connectToDBWithMongosoose from "./src/config/mongoose.config.js";
import ApplicationError from "./src/error_handler/app.error.js";
import { appLevelErrorHandlerMiddleware } from "./src/error_handler/app.error.js";
import userRoutes from "./src/features/users/users.routes.js";
import postRoutes from "./src/features/posts/posts.routes.js";

//connecting to db
connectToDBWithMongosoose();

const app = express();

app.use(cors());
app.use(express.json());

//serving static files
app.use("/public", express.static("public"));

//userRoutes
app.use("/api/users", userRoutes);

//postsRoutes
app.use("/api/posts", postRoutes);

app.use(appLevelErrorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Postway api is working");
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
