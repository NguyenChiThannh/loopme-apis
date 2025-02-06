import express from 'express'
import cors from 'cors'
import { corsOptions } from './configs/cors'
import exitHook from 'async-exit-hook'
import { APIs_V1 } from './routes'
import { errorHandlingMiddleware } from '@loopme/common'
import cookieParser from 'cookie-parser'
import connectDB from './configs/mongodb'
import 'dotenv/config'

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

    // use APIs V1
    app.use('/', (req, res) => {
        console.log('🚀 ~ Request received');
        console.log('Method:', req.method);
        console.log('Full URL:', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);

        res.send('Check server logs for details.');
    });


    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware)

    app.listen(Number(process.env.APP_PORT), process.env.APP_HOST || 'localhost', () => {
        // eslint-disable-next-line no-console
        console.log(`3.Auth-service running at PORT ${process.env.APP_HOST}:${process.env.APP_PORT}`)
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
