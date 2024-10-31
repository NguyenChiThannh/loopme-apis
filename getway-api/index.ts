import express from 'express'
import cors from 'cors'
import proxy from 'express-http-proxy'

const app = express();

app.use(cors());
app.use(express.json());



app.use("/", proxy("http://localhost:8001"));
app.use("/socket", proxy("http://localhost:8003"));

app.listen(8000, () => {
    console.log("Gateway is Listening to Port 8000");
});


app.use((err, req, res, next) => {
    console.error("Proxy error:", err);
    res.status(500).send("An error occurred in the gateway.");
});

