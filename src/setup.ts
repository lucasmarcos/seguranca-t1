import { writeFileSync } from "node:fs";
import { gerarCertificado, gerarChavesAssimetricas } from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
  gerarChavesAssimetricas();
const cerificadoDaAlice = gerarCertificado("alice", chavePublicaDaAlice);
writeFileSync("./certificado_da_alice.json", JSON.stringify(cerificadoDaAlice));
writeFileSync(
  "./chave_privada_da_alice.json",
  JSON.stringify(chavePrivadaDaAlice),
);

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
  gerarChavesAssimetricas();
const certificadoDoBob = gerarCertificado("bob", chavePublicaDoBob);
writeFileSync("./certificado_do_bob.json", JSON.stringify(certificadoDoBob));
writeFileSync("./chave_privada_do_bob.json", JSON.stringify(chavePrivadaDoBob));
