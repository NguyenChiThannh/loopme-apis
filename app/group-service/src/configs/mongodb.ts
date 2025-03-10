// // Config connect mongo Atlas
// import { MongoClient, ServerApiVersion } from 'mongodb'
// import dotenv from 'dotenv';
// dotenv.config();
// let databaseInstance = null

// // Khởi tạo một đối tượng mongoClientInstance để connect tới MongoDB
// const mongoClientInstance = new MongoClient(process.env.MONGODB_URI)

// //Kết nối tới Database
// export const CONNECT_DB = async () => {
//     // Gọi kết nối tới MongoDB Atlas với URI
//     await mongoClientInstance.connect()
//     // Kết nói thành công thì lấy ra Database theo tên và gán ngược lại vào biến databaseInstance ở trên
//     databaseInstance = mongoClientInstance.db(process.env.DATABASE_NAME)
// }

// // Đóng kết nối tới Database
// export const CLOSE_DB = async () => {
//     await mongoClientInstance.close()
// }

// // Function GET_DB (không async) này có nhiệm vụ export ra cái dDatabase Instance sau khi đã connect thành công tới MongoDB để chúng ta sử dụng ở nhiều nơi khác nhau trong code
// // Lưu ý phải đảm bảo chỉ luôn gọi cái getDB này sau khi kết nối thành công tới MongoDB
// export const GET_DB = () => {
//     if (!databaseInstance) throw new Error('Must connect to database first')
//     return databaseInstance
// }


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

// Xuất hàm connectDB để sử dụng ở nơi khác trong ứng dụng
export default connectDB;