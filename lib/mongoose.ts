import mongoose from "mongoose";

export const connectMongoose = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URI!);
};
