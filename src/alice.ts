import { createServer } from "node:net";
import { createHash } from "node:crypto";

const hash = createHash("sha256");

const server = createServer((client) => {
  console.log(client);
});

server.listen("./socket");
