import { createServer } from "node:net";
import { simetrica } from "./lib.js";

const chaveSimetrica = simetrica();

const server = createServer((client) => {
  console.log(client);
});

server.listen("./socket");
