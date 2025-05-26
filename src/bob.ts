import { createConnection } from "node:net";
import { simetrica } from "./lib.js";

const chaveSimetrica = simetrica();

const client = createConnection({ path: "./socket" }, () => {
  console.log(client);
});
