import {
  createCipheriv,
  createHash,
  generateKeyPairSync,
  generateKeySync,
  randomBytes,
} from "node:crypto";

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

export const encriptar = (mensagem: string, chave: string) => {
  const vetorAleatorio = randomBytes(16);
  const chaveSimetrica = Buffer.from(chave, "base64");

  const cifra = createCipheriv("aes-128-cbc", chaveSimetrica, vetorAleatorio);

  let mensagemEncriptada = cifra.update(mensagem, "utf-8", "base64");
  mensagemEncriptada += cifra.final("base64");

  return {
    mensagemEncriptada,
    vetorAleatorio: vetorAleatorio.toString("base64"),
  };
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
