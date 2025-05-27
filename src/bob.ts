import { connect } from "node:net";
import {
  assinar,
  encriptar,
  encriptarComChavePublica,
  gerarChaveSimetrica,
  hash,
  lerArquivo,
} from "./lib.js";

const cerficadoDaAlice = JSON.parse(lerArquivo("certificado-alice.json"));
const chavePublicaDaAlice = cerficadoDaAlice.chavePublica;
const chavePrivadaDoBob = lerArquivo("chave-privada-bob.pem");

const socket = connect({ port: 3000, host: "127.0.0.1" }, () => {
  const chaveSimetrica = gerarChaveSimetrica();

  const encriptado = encriptarComChavePublica(
    chaveSimetrica,
    chavePublicaDaAlice,
  ).toString("base64");

  const assinado = assinar(encriptado, chavePrivadaDoBob);

  socket.write(JSON.stringify({ encriptado, assinado }));

  const texto = "Olá, Alice! Mensagem segura.";
  const { mensagemEncriptada, vetorAleatorio } = encriptar(
    texto,
    chaveSimetrica,
  );

  const h = hash(texto);
  const sig = assinar(h, chavePrivadaDoBob);

  socket.write(JSON.stringify({ mensagemEncriptada, vetorAleatorio, h, sig }));
});
