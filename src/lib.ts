import { createHash } from "node:crypto";

export const hashify = (mensagem) => {
  const hash = createHash("sha256");
  hash.update(mensagem);
  return hash.digest("hex");
};



