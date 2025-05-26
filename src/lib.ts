import { createHash } from "node:crypto";

// SHA-256
export const hash = (mensagem) => {
  return createHash("sha256").update(mensagem).digest("hex");
};

// AES
export const simetrica = () => {};

// RSA
export const assimetrica = () => {};

export const assinatura = () => {};

export const certificado = () => {};


