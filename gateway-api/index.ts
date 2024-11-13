import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'
import { createProxyMiddleware } from 'http-proxy-middleware';
import 'dotenv/config'
import { rateLimit } from 'express-rate-limit'

const app = express();

// // Middleware
app.use(
    cors({
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
            "tojson",
        ],
        optionsSuccessStatus: 200,
        maxAge: 3600,
        origin: "http://localhost:5173",
    })
);

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
}));

// Debug middleware
app.use((req, res, next) => {
    console.log('=== Gateway Debug ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    console.log('===================');
    next();
});

// Socket.IO proxy
app.use('/socket.io', createProxyMiddleware({
    target: process.env.SOCKET_SERVICE,
    changeOrigin: true,
    ws: true,
}));

// API proxy
app.use('/', proxy(process.env.CORE_SERVICE, {
    proxyReqPathResolver: (req) => req.url,
    proxyErrorHandler: (err, res, next) => {
        console.error('API Proxy Error:', err);
        next(err);
    }
}));


app.listen(Number(process.env.PORT), () => {
    console.log(`Gateway running at http://localhost:${process.env.PORT}`);
});