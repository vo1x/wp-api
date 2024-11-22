import Express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import router from "./routes/routes.ts";

const app = Express();
app.use(Express.json());

const PORT = process.env.PORT ?? 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://uhdbuilder.vercel.app",
  "https://anotherdomain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin ?? "") !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const wpProxy = createProxyMiddleware({
  target: "https://uhdmovies.icu",
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
