import { createHash } from "node:crypto";
import { createServer } from "node:net";

const hash = createHash("sha256");

const server = createServer((client) => {
  console.log(client);
});

server.listen("./socket");
