import redis from "redis";
import http from "http";
//connect to the redis client
const client = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect().catch(console.error);

//set a  cached response
export const setCache = async (key, value) => {
  await client.set(key, JSON.stringify(value));
};

export const getCache = async (key) => {
  const result = await client.get(key);
  http.ServerResponse.wr;
  return result ? JSON.stringify(result) : null;
};

export const clearCache = async () => {
  await client.flushAll();
  console.log("Cache cleared successfully");
};
