import { generateAsymmetricKeys, generateCertificate, saveFile } from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } = generateAsymmetricKeys();

const certificadoDaAlice = generateCertificate("alice", chavePublicaDaAlice);

saveFile("certificado_da_alice.json", JSON.stringify(certificadoDaAlice));
saveFile("chave_privada_da_alice.json", JSON.stringify(chavePrivadaDaAlice));

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } = generateAsymmetricKeys();

const certificadoDoBob = generateCertificate("bob", chavePublicaDoBob);

saveFile("certificado_do_bob.json", JSON.stringify(certificadoDoBob));
saveFile("chave_privada_do_bob.json", JSON.stringify(chavePrivadaDoBob));
