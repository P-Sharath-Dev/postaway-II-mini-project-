import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import connectToDBWithMongosoose from "./src/config/mongoose.config.js";
import ApplicationError from "./src/error_handler/app.error.js";
import { appLevelErrorHandlerMiddleware } from "./src/error_handler/app.error.js";
import userRoutes from "./src/features/users/users.routes.js";
import postRoutes from "./src/features/posts/posts.routes.js";
import commentRoutes from "./src/features/comments/comments.routes.js";
import likeRoutes from "./src/features/likes/likes.routes.js";
import friendshipRoutes from "./src/features/friendships/friendships.routes.js";
import otpRoutes from "./src/features/otp/otp.routes.js";

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

//commentsRoutes
app.use("/api/comments", commentRoutes);

//likesRoutes
app.use("/api/likes", likeRoutes);

//friendshipsRoutes
app.use("/api/friendships", friendshipRoutes);

//otpRoutes
app.use("/api/otp", otpRoutes);

app.use(appLevelErrorHandlerMiddleware);

app.get("/", (req, res) => {
  res.send("Postway api is working");
});

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
