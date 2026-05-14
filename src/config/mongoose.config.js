import mongoose from "mongoose";

const url = process.env.DB_URL;

//conneting to database using mongoose
export default async function connectToDBWithMongosoose() {
  try {
    await mongoose.connect(url);
    console.log("connected successfully to database using mongoose");
  } catch (error) {
    console.log("error connecting with db", error);
  }
}
