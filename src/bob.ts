import { createConnection } from "node:net";

const client = createConnection({ path: "./socket" }, () => {
  console.log(client);
});
