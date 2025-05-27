import type { CipherKey } from "node:crypto";
import { createServer } from "node:net";
import {
  decriptar,
  decriptarComChavePrivada,
  hash,
  lerArquivo,
  verificar,
} from "./lib.js";

const cerificadoDoBob = JSON.parse(lerArquivo("certificado-bob.json"));
const chavePublicaDoBob = cerificadoDoBob.chavePublica;
const chavePrivadaDaAlice = lerArquivo("chave-privada-alice.pem");

let chaveSimetrica: CipherKey;

const server = createServer((socket) => {
  console.log("alice: bob se conectou.");

  socket.on("data", (data) => {
    console.log(`alice: recebendo mensagem ${data}`);
    const mensagens = data
      .toString()
      .split("}{")
      .map((m, i, arr) => {
        if (arr.length > 1 && i !== arr.length - 1) return `${m}}`;
        if (i !== 0) return `{${m}`;
        return m;
      });

    for (const msg of mensagens) {
      const recebido = JSON.parse(msg);

      if (recebido.encriptado) {
        const { encriptado, assinado } = recebido;

        const ok = verificar(encriptado, assinado, chavePublicaDoBob);

        if (!ok) {
          console.error("alice: assinatura inválida na chave simétrica.");
          socket.destroy();
          return;
        }
        console.log("alice: assinatura valida");

        chaveSimetrica = decriptarComChavePrivada(
          encriptado,
          chavePrivadaDaAlice,
        );

        console.log("alice: chave simétrica recebida e verificada");
      } else if (recebido.mensagemEncriptada) {
        const { mensagemEncriptada, vetorAleatorio, h, sig } = recebido;

        const ok = verificar(h, sig, chavePublicaDoBob);

        if (!ok) {
          console.error("alice: assinatura inválida na mensagem");
          socket.destroy();
          return;
        }
        console.log("alice: assinatura valida");

        const mensagem = decriptar(
          mensagemEncriptada,
          chaveSimetrica,
          vetorAleatorio,
        );

        if (h !== hash(mensagem)) {
          console.error("alice: hash incorreto");
          socket.destroy();
          return;
        }
        console.log("alice: hash validado");

        console.log(`alice: mensagem recebida "${mensagem}"`);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("alice: aguardando conexão de bob");
});
