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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, "..");
const BASE_PATH = resolve(ROOT_DIR, "out");

export const salvarArquivo = (nome: string, conteudo: string) => {
  if (!existsSync(BASE_PATH)) {
    mkdirSync(BASE_PATH, { recursive: true });
  }
  const caminho = join(BASE_PATH, nome);
  writeFileSync(caminho, conteudo);
};

export const lerArquivo = (nome: string) => {
  const caminho = join(BASE_PATH, nome);
  return readFileSync(caminho, "utf-8");
};

// SHA-256
// Hash para verificação de integridade,
// Hash (SHA-256): Garante que a mensagem não foi alterada
export const hash = (mensagem: string) => {
  return createHash("sha256").update(mensagem).digest("base64");
};

// AES
// Criptografia simétrica para proteger o conteúdo da mensagem
// Criptografia Simétrica (AES): Usada para criptografar a mensagem com uma única chave
export const gerarChaveSimetrica = () => {
  return randomBytes(16).toString("base64");
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

export const decriptar = (
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
// Criptografia assimétrica para troca segura da chave simétrica
// Criptografia Assimétrica (RSA):
//   Usada para proteger a chave simétrica durante a transmissão
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

export const encriptarComChavePublica = (
  mensagem: string,
  chavePublica: string,
) => {
  return publicEncrypt(chavePublica, mensagem);
};

export const decriptarComChavePublica = (
  mensagem: string,
  chavePublica: string,
) => {
  return publicDecrypt(chavePublica, mensagem);
};

export const encriptarComChavePrivada = (
  mensagem: string,
  chavePrivada: string,
) => {
  return privateDecrypt(chavePrivada, mensagem);
};

export const decriptarComChavePrivada = (
  mensagem: string,
  chavePrivada: string,
) => {
  return privateDecrypt(chavePrivada, mensagem);
};

// Assinatura
// Assinatura digital para autenticar o remetente
// Assinatura Digital: Garantia de autenticidade da mensagem
export const assinar = (mensagem: string, chavePrivada: string) => {
  const assinador = createSign("SHA256");
  assinador.update(mensagem);
  assinador.end();
  return assinador.sign(chavePrivada, "base64");
};

export const verificar = (
  mensagem: string,
  assinatura: string,
  chavePublica: string,
) => {
  const assinaturaBuffer = Buffer.from(assinatura, "base64");
  const verificador = createVerify("SHA256");
  verificador.update(mensagem);
  verificador.end();
  return verificador.verify(chavePublica, assinaturaBuffer);
};

// Certificado
// Certificado digital simulado para validar a chave pública do remetente
// Certificado Digital: Confirma a identidade do remetente (simulado via JSON, por exemplo)
export const gerarCertificado = (dono: string, chavePublica: string) => {
  return JSON.stringify({
    dono,
    chavePublica,
  });
};
