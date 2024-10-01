#!/usr/bin/env node
//handle the main CLI
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { clearCache } from "./cache.js";
import { startServer } from "./proxyServer.js";

const argv = yargs(hideBin(process.argv))
  .option("port", {
    alias: "p",
    type: "number",
    description: "Caching server running port",
    demandOption: "true",
  })
  .option("origin", {
    alias: "o",
    type: "string",
    description: "URL of the origin server to which requests are forwarded",
    demandOption: true,
  })
  .option("clear-cache", {
    alias: "c",
    type: "boolean",
    description: "Clear the cache",
  })
  .help().argv;

if (argv["clear-cache"]) {
  clearCache()
    .then(() => {
      console.log("Cache cleared Successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} else {
  startServer(argv.port, argv.origin);
}
