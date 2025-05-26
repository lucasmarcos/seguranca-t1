import { writeFileSync } from "node:fs";
import { assimetrica, certificado } from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
  assimetrica();
const cerificadoDaAlice = certificado("alice", chavePublicaDaAlice);
writeFileSync("./certificado_da_alice.json", JSON.stringify(cerificadoDaAlice));

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
  assimetrica();
const certificadoDoBob = certificado("bob", chavePublicaDoBob);
writeFileSync("./certificado_do_bob.json", JSON.stringify(certificadoDoBob));
