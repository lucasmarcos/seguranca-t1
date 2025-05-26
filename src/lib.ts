import { createHash, generateKeyPairSync, generateKeySync } from "node:crypto";

// SHA-256
export const hash = (mensagem) => {
  return createHash("sha256").update(mensagem).digest("hex");
};

// AES
export const simetrica = () => {
  const key = generateKeySync("aes", { length: 256 });
  const buffer = key.export();
  return buffer.toString("base64");
};

// RSA
export const assimetrica = () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return { publicKey, privateKey };
};

export const assinatura = () => {};

export const certificado = (dono: string, chavePublica: string) => {
  return {
    dono,
    chavePublica,
  };
};
