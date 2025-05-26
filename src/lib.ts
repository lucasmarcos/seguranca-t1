import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createSign,
  createVerify,
  generateKeyPairSync,
  generateKeySync,
  privateDecrypt,
  publicDecrypt,
  publicEncrypt,
  randomBytes,
} from "node:crypto";

// SHA-256
// Hash para verificação de integridade
export const hash = (mensagem) => {
  return createHash("sha256").update(mensagem).digest("hex");
};

// AES
// Criptografia simétrica para proteger o conteúdo da mensagem
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
// Criptografia assimétrica para troca segura da chave simétrica
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

export const desencriptarComChavePublica = (
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

export const desencriptarComChavePrivada = (
  mensagem: string,
  chavePrivada: string,
) => {
  return privateDecrypt(chavePrivada, mensagem);
};

// Assinatura
// Assinatura digital para autenticar o remetente
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
export const gerarCertificado = (dono: string, chavePublica: string) => {
  return {
    dono,
    chavePublica,
  };
};
