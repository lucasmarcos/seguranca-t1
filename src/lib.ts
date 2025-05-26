import {
  createCipheriv,
  createDecipheriv,
  createHash,
  generateKeyPairSync,
  generateKeySync,
  publicDecrypt,
  publicEncrypt,
  randomBytes,
} from "node:crypto";

// SHA-256
export const hash = (mensagem) => {
  return createHash("sha256").update(mensagem).digest("hex");
};

// AES
export const gerarChaveSimetrica = () => {
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

const desencriptar = (
  mensagemEncriptada: string,
  chave: string,
  vetorAleatorio: string,
) => {
  const chaveSimetrica = Buffer.from(chave, "base64");
  const vetorAleatorioBuffer = Buffer.from(vetorAleatorio, "base64");

  const decifra = createDecipheriv(
    "aes-128-cbc",
    chaveSimetrica,
    vetorAleatorioBuffer,
  );

  let mensagemDecriptada = decifra.update(
    mensagemEncriptada,
    "base64",
    "utf-8",
  );
  mensagemDecriptada += decifra.final("utf-8");

  return mensagemDecriptada;
};

// RSA
export const gerarChavesAssimetricas = () => {
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

export const assinar = (chavePrivada: string, hash: string) => {};

export const gerarCertificado = (dono: string, chavePublica: string) => {
  return {
    dono,
    chavePublica,
  };
};
