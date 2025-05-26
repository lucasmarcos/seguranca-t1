import { createConnection } from "net";
import {
  encryptWithPublicKey,
  signMessage,
  encryptAES,
  sha256Hash,
  readFile,
} from "./lib.js";
import { randomBytes } from "crypto";

const certAlice = JSON.parse(readFile("certificado-alice.json"));
const pubAlice = certAlice.chavePublica;
const privBob = readFile("chave-privada-bob.pem", "utf-8");

const socket = createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  const symKey = randomBytes(16).toString("base64");

  const encryptedSymKey = encryptWithPublicKey(
    Buffer.from(symKey, "base64"),
    pubAlice
  ).toString("base64");

  const sigKey = signMessage(encryptedSymKey, privBob);

  socket.write(JSON.stringify({ encryptedSymKey, signature: sigKey }));

  const texto = "Olá, Alice! Mensagem segura.";
  const { mensagemEncriptada: ciphertext, vetorAleatorio: iv } = encryptAES(
    texto,
    symKey
  );

  const h = sha256Hash(texto);
  const sigMsg = signMessage(h, privBob);

  socket.write(JSON.stringify({ iv, ciphertext, hash: h, signature: sigMsg }));
});
