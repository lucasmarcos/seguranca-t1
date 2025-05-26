import { createConnection } from "net";
import {
  encriptarComChavePublica,
  assinar,
  encriptar,
  hash,
} from "./lib.js";
import { lerArquivo } from "./lib.js";
import { randomBytes } from "crypto";

const certAlice = JSON.parse(lerArquivo("certificado-alice.json"));
const pubAlice = certAlice.chavePublica;
const privBob = lerArquivo("chave-privada-bob.pem", "utf-8");

const socket = createConnection({ port: 3000, host: "127.0.0.1" }, () => {
  const symKey = randomBytes(16).toString("base64");

  const encryptedSymKey = encriptarComChavePublica(
    Buffer.from(symKey, "base64"),
    pubAlice
  ).toString("base64");

  const sigKey = assinar(encryptedSymKey, privBob);

  socket.write(JSON.stringify({ encryptedSymKey, signature: sigKey }));

  const texto = "Olá, Alice! Mensagem segura.";
  const { mensagemEncriptada: ciphertext, vetorAleatorio: iv } = encriptar(
    texto,
    symKey
  );
  const h = hash(texto);
  const sigMsg = assinar(h, privBob);

  socket.write(JSON.stringify({ iv, ciphertext, hash: h, signature: sigMsg }));
});
