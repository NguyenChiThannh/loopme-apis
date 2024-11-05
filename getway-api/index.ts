import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'
import 'dotenv/config'
import { rateLimit } from 'express-rate-limit'

const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
})

app.use(cors());
app.use(express.json());
app.use(limiter)

app.use("/", proxy(process.env.CORE_SERVICE));
app.use("/socket", proxy(process.env.SOCKET_SERVICE));

app.listen(process.env.PORT, () => {
    console.log(`Gateway is Listening to Port ${process.env.PORT}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Proxy error:", err);
    res.status(500).send("An error occurred in the gateway.");
});