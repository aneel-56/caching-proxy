# CACHING PROXY CLI

A server that sits between clients and a target server to intercept and cache responses with CLI tool

## HOW IT WORKS

When a client requests data, the proxy checks if the data is already stored (cached). If so, it serves the cached version instead of querying the target server, reducing load times and server requests

## INSTALLATION
npm install

### CONFIG (if you use redis cloud)

```bash
# Create environment variables

touch .env

YOUR_REDIS_HOST:REDIS_PORT

## USAGE

### Starting the Caching Proxy Server

To start the caching proxy server, run the following command:

```bash
node index.js --port <number> --origin <url>
```

- `-p, --port`: Port on which the proxy server will run
- `-o, --origin`: The origin URL to which the proxy will forward requests.

For example if the user runs the following command:

```bash
caching-proxy --port 3000 --origin http://dummyjson.com
```

Taking the above example, if the user makes a request to http://localhost:3000/products, the caching proxy server should forward the request to http://dummyjson.com/products, return the response along with headers and cache the response

```
# If the response is from the cache

X-Cache: HIT

# If the response is from the origin server

X-Cache: MISS
```

### Clearing the Cache

You can clear the cache by running the following command:

```bash
caching-proxy clear-cache
