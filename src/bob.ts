import { createConnection } from "node:net";
import { createHash } from "node:crypto";

const hash = createHash("sha256");

const client = createConnection({ path: "./socket" }, () => {
  console.log(client);
});
