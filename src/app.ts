import Express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import router from "./routes/routes";

const app = Express();
app.use(Express.json());

const PORT = process.env.PORT ?? 5000;


app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const wpProxy = createProxyMiddleware({
  target: "https://uhdmovies.mov",
  changeOrigin: true,
  pathRewrite: {
    "^/wp-json": "/wp-json", 
  },
});

app.use("/wp-json", wpProxy);

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});
