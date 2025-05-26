import { createServer } from "net";
import {
  decryptWithPrivateKey,
  verifySignature,
  decryptAES,
  sha256Hash,
  readFile,
} from "./lib.js";

const privAlice = readFile("chave-privada-alice.pem", "utf-8");
const certBob = JSON.parse(readFile("certificado-bob.json"));
const pubBob = certBob.chavePublica;

let symKey = "";

const server = createServer((socket) => {
  console.log("Alice: Bob se conectou.");

  socket.on("data", (data) => {
    const mensagens = data
      .toString()
      .split("}{")
      .map((m, i, arr) => {
        if (arr.length > 1 && i !== arr.length - 1) return m + "}";
        if (i !== 0) return "{" + m;
        return m;
      });

    mensagens.forEach((msg) => {
      const recebido = JSON.parse(msg);

      if (recebido.encryptedSymKey) {
        const { encryptedSymKey, signature } = recebido;

        const signatureOk = verifySignature(encryptedSymKey, signature, pubBob);

        if (!signatureOk) {
          console.error("Assinatura inválida na chave simétrica.");
          socket.destroy();
          return;
        }

        const symKeyBuffer = decryptWithPrivateKey(
          Buffer.from(encryptedSymKey, "base64"),
          privAlice
        );

        symKey = symKeyBuffer.toString("base64");
        console.log("Chave simétrica recebida e verificada.");
      } else if (recebido.ciphertext) {
        const { iv, ciphertext, hash: h, signature } = recebido;

        const hashOk = verifySignature(h, signature, pubBob);

        if (!hashOk) {
          console.error("Assinatura inválida na mensagem.");
          socket.destroy();
          return;
        }

        const mensagem = decryptAES(ciphertext, symKey, iv);

        if (h !== sha256Hash(mensagem)) {
          console.error("Hash incorreto: integridade comprometida.");
          socket.destroy();
          return;
        }

        console.log("Mensagem recebida:", mensagem);
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Alice: aguardando conexão de Bob...");
});
