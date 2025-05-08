import { createHash } from "node:crypto";
import { createConnection } from "node:net";

const hash = createHash("sha256");

const client = createConnection({ path: "./socket" }, () => {
  console.log(client);
});
