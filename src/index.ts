/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from '@/config/cors'
import exitHook from 'async-exit-hook'
// import { CONNECT_DB, CLOSE_DB } from '@/config/mongodb'
import { APIs_V1 } from '@/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import connectDB from '@/config/mongodb'


const app = express()

const START_SEVER = () => {

    // Cors
    app.use(cors(corsOptions))

    // Config cookie
    app.use(cookieParser())

    //Enable req.body json data
    app.use(express.json())

    // use APIs V1
    app.use('/v1', APIs_V1)

    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)

    app.listen(5000, () => {
        // eslint-disable-next-line no-console
        console.log(`3.I am  running at PORT :5000/`)
    })
    exitHook(() => {
        // CLOSE_DB()
        console.log('4. Đã ngắt kết nối tới MongoDB')
    })
}

(async () => {
    try {
        console.log('1.Connecting to MongoDB...')
        await connectDB()
        console.log('2.Connected to MongoDB')
        await START_SEVER()
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
})()
