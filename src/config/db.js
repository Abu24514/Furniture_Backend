import mongoose from "mongoose";

const connectToDb = async () => {
  const uri = process.env.MONGODB_URL;

  if (!uri) {
    console.error("MONGODB_URL is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Database connected successfully!");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected.");
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectToDb;