import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import router from "./routes/routes";

const app = express();

const PORT = process.env.PORT ?? 5000;
const BASE_URL = process.env.BASE_URL;

const allowedOrigins = [
  "https://uhdposters.vercel.app",
  "https://cloudfiler.vercel.app",
  "https://uhdbuilder.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

const wpProxy = createProxyMiddleware({
  target: BASE_URL,
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
