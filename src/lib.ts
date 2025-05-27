import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createSign,
  createVerify,
  generateKeyPairSync,
  privateDecrypt,
  publicDecrypt,
  publicEncrypt,
  randomBytes,
} from "node:crypto";

import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BASE_PATH = path.resolve(ROOT_DIR, "out");

export function saveFile(nome: string, conteudo: string | Buffer) {
  if (!fs.existsSync(BASE_PATH)) {
    fs.mkdirSync(BASE_PATH, { recursive: true });
  }
  const filePath = path.join(BASE_PATH, nome);
  fs.writeFileSync(filePath, conteudo);
}

export function readFile(nome: string, encoding: BufferEncoding = "utf-8") {
  const filePath = path.join(BASE_PATH, nome);
  return fs.readFileSync(filePath, encoding);
}

// SHA-256
export const sha256Hash = (mensagem: string) => {
  return createHash("sha256").update(mensagem).digest("hex");
};

// AES
export const generateSymmetricKey = () => {
  const key = randomBytes(16);
  return key.toString("base64");
};

export const encryptAES = (mensagem: string, chave: string) => {
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

export const decryptAES = (
  mensagemEncriptada: string,
  chave: string,
  vetorAleatorio: string
) => {
  const chaveSimetrica = Buffer.from(chave, "base64");
  const vetorAleatorioBuffer = Buffer.from(vetorAleatorio, "base64");

  const decifra = createDecipheriv(
    "aes-128-cbc",
    chaveSimetrica,
    vetorAleatorioBuffer
  );

  let mensagemDecriptada = decifra.update(
    mensagemEncriptada,
    "base64",
    "utf-8"
  );
  mensagemDecriptada += decifra.final("utf-8");

  return mensagemDecriptada;
};

// RSA
export const generateAsymmetricKeys = () => {
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

export const encryptWithPublicKey = (
  mensagem: Buffer | string,
  chavePublica: string
) => {
  return publicEncrypt(chavePublica, mensagem);
};

export const decryptWithPublicKey = (
  mensagem: Buffer,
  chavePublica: string
) => {
  return publicDecrypt(chavePublica, mensagem);
};

export const encryptWithPrivateKey = (
  mensagem: Buffer | string,
  chavePrivada: string
) => {
  return privateDecrypt(chavePrivada, mensagem);
};

export const decryptWithPrivateKey = (
  mensagem: Buffer,
  chavePrivada: string
) => {
  return privateDecrypt(chavePrivada, mensagem);
};

// Assinatura
export const signMessage = (mensagem: string, chavePrivada: string) => {
  const assinador = createSign("SHA256");
  assinador.update(mensagem);
  assinador.end();
  return assinador.sign(chavePrivada, "base64");
};

export const verifySignature = (
  mensagem: string,
  assinatura: string,
  chavePublica: string
) => {
  const assinaturaBuffer = Buffer.from(assinatura, "base64");
  const verificador = createVerify("SHA256");
  verificador.update(mensagem);
  verificador.end();
  return verificador.verify(chavePublica, assinaturaBuffer);
};

// Certificado
export const generateCertificate = (dono: string, chavePublica: string) => {
  return {
    dono,
    chavePublica,
  };
};
