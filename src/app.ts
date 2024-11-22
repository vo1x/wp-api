import Express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import router from "./routes/routes";

const app = Express();

const PORT = process.env.PORT ?? 5000;

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

app.use(Express.json());

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
