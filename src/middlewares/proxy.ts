import { createProxyMiddleware } from "http-proxy-middleware";

const baseUrl = "https://uhdmovies.mov";

const wpProxy = createProxyMiddleware({
  target: baseUrl,
  changeOrigin: true,
 
});

export default wpProxy;
