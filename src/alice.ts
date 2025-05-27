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

let chaveSimetrica: string;

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

      if (recebido.encriptado) {
        const { encriptado, assinado } = recebido;

        const ok = verificar(encriptado, assinado, chavePublicaDoBob);

        if (!ok) {
          console.error("Assinatura inválida na chave simétrica.");
          socket.destroy();
          return;
        }

        const chaveSimetricaBuffer = decriptarComChavePrivada(
          encriptado,
          chavePrivadaDaAlice,
        );

        chaveSimetrica = chaveSimetricaBuffer.toString("base64");
        console.log("Chave simétrica recebida e verificada.");
      } else if (recebido.mensagemEncriptada) {
        const { mensagemEncriptada, vetorAleatorio, h, sig } = recebido;

        const ok = verificar(h, sig, chavePublicaDoBob);

        if (!ok) {
          console.error("Assinatura inválida na mensagem.");
          socket.destroy();
          return;
        }

        const mensagem = decriptar(
          mensagemEncriptada,
          chaveSimetrica,
          vetorAleatorio,
        );

        if (h !== hash(mensagem)) {
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
