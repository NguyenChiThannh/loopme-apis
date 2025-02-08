import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/loopme";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("🔄 Using existing MongoDB connection");
            return mongoose.connection;
        }

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB Connected Successfully");
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;