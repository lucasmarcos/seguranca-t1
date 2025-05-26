import { createConnection } from "node:net";
import { gerarChaveSimetrica } from "./lib.js";

const chaveSimetrica = gerarChaveSimetrica();

const client = createConnection({ path: "./socket" }, () => {
  console.log(client);
});
