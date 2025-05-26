import { createServer } from "node:net";

const server = createServer((client) => {
  console.log(client);
});

server.listen("./socket");
