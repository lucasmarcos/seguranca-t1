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
  console.log("bob: gerada chave simetrica");

  const encriptado = encriptarComChavePublica(
    chaveSimetrica,
    chavePublicaDaAlice,
  ).toString("base64");

  console.log("bob: encriptada chave simetrica com chave publica de alice");

  const assinado = assinar(encriptado, chavePrivadaDoBob);

  console.log(
    "bob: assinada chave simetrica encriptada com chave privada de bob",
  );

  socket.write(JSON.stringify({ encriptado, assinado }));

  console.log("bob: enviado chave simetrica encriptada e assinada");

  const texto = "olá alice! mensagem segura!";

  console.log(`bob: encriptando mensagem "${texto}"`);

  const { mensagemEncriptada, vetorAleatorio } = encriptar(
    texto,
    chaveSimetrica,
  );

  console.log("bob: mensagem encriptada com chave simetrica");

  const h = hash(texto);
  const sig = assinar(h, chavePrivadaDoBob);

  socket.write(JSON.stringify({ mensagemEncriptada, vetorAleatorio, h, sig }));

  console.log("bob: enviado hash da mensagem e assinatura");

  socket.end();

  console.log("bob: finalizado");
});
