import http from "http";
import httpProxy from "http-proxy";
import { getCache, setCache } from "./cache.js";

const proxy = httpProxy.createProxyServer({});

export const startServer = (port, origin) => {
  http
    .createServer(async (req, res) => {
      let sentResponse = false; // Flag to track if a response has been sent
      console.log(`Incoming request: ${req.method} ${req.url}`);
      const cacheKey = `${req.method}:${req.url}`;
      const cachedResponse = await getCache(cacheKey);

      if (cachedResponse) {
        console.log("Serving response from cache...");
        res.writeHead(200, {
          "Content-Type": "application/json",
          "X-Cache": "HIT",
        });
        res.end(JSON.stringify(cachedResponse));
        sentResponse = true;
        return; // Exit early to prevent further processing
      }

      console.log("Forwarding request to origin server...");

      // Forward the request to the origin server
      proxy.web(req, res, { target: origin }, (error) => {
        if (sentResponse) return; // If response has already been sent, do nothing
        sentResponse = true; // Mark that a response is being sent

        // Handle errors while connecting to the origin server
        console.error(
          `Error forwarding request to origin server: ${error.message}`
        );
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end("Bad Gateway - Could not connect to origin server");
      });

      // Listen for the 'proxyRes' event to handle the response from the origin server
      proxy.on("proxyRes", (proxyRes, req, res) => {
        let body = "";

        // Collect response data chunks
        proxyRes.on("data", (chunk) => {
          body += chunk;
        });

        // Once the response is fully received, cache and send it to the client
        proxyRes.on("end", async () => {
          if (sentResponse) return; // If response has already been sent, do nothing
          sentResponse = true; // Mark that a response is being sent

          console.log(
            "Response received from origin server, caching and sending to client..."
          );
          // res.setHeader("X-Cache", "MISS"); // Set header indicating a cache miss
          await setCache(cacheKey, body); // Cache the response
          res.end(body); // Send the response to the client
        });
      });
    })
    .listen(port, () => {
      console.log(
        `Caching proxy server started on port ${port}, forwarding to ${origin}`
      );
    });
};
