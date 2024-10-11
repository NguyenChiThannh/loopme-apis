import 'dotenv/config'
import { NextFunction, Request, Response } from 'express'

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
export const errorHandlingMiddleware = (err, req: Request, res: Response, next: NextFunction) => {

    // Nếu dev không cẩn thận thiếu statusCode thì mặc định sẽ để code 500 INTERNAL_SERVER_ERROR
    if (!err.statusCode) err.statusCode = 500

    // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
    const responseError = {
        statusCode: err.statusCode,
        message: err.message || err.statusCode, // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack
    }

    // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi.
    if (process.env.BUILD_MODE !== 'dev') delete responseError.stack

    // Trả responseError về phía Front-end
    res.status(responseError.statusCode).json(responseError)
}