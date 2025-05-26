import { createServer } from "node:net";
import { gerarChaveSimetrica } from "./lib.js";

const chaveSimetrica = gerarChaveSimetrica();

const server = createServer((client) => {
  console.log(client);
});

server.listen("./socket");
