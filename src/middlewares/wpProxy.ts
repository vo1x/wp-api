import { createProxyMiddleware } from "http-proxy-middleware";

const baseUrl = process.env.BASE_URL

const wpProxy = createProxyMiddleware({
  target: baseUrl,
  changeOrigin: true,
 
});

export default wpProxy;
