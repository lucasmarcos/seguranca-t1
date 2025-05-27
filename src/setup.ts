import {
  gerarCertificado,
  gerarChavesAssimetricas,
  salvarArquivo,
} from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
  gerarChavesAssimetricas();

const certificadoDaAlice = gerarCertificado("alice", chavePublicaDaAlice);

salvarArquivo("certificado_da_alice.json", certificadoDaAlice);
console.log("salvo certificado da alice");

salvarArquivo("chave_privada_da_alice.json", chavePrivadaDaAlice);
console.log("salva chave privada da alice");

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
  gerarChavesAssimetricas();

const certificadoDoBob = gerarCertificado("bob", chavePublicaDoBob);

salvarArquivo("certificado_do_bob.json", certificadoDoBob);
console.log("salvo certificado do bob");

salvarArquivo("chave_privada_do_bob.json", chavePrivadaDoBob);
console.log("salva chava privada do bob");
