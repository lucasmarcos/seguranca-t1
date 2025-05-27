import {
  gerarCertificado,
  gerarChavesAssimetricas,
  salvarArquivo,
} from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
  gerarChavesAssimetricas();

const certificadoDaAlice = gerarCertificado("alice", chavePublicaDaAlice);

salvarArquivo("certificado_da_alice.json", certificadoDaAlice);
salvarArquivo("chave_privada_da_alice.json", chavePrivadaDaAlice);

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
  gerarChavesAssimetricas();

const certificadoDoBob = gerarCertificado("bob", chavePublicaDoBob);

salvarArquivo("certificado_do_bob.json", certificadoDoBob);
salvarArquivo("chave_privada_do_bob.json", chavePrivadaDoBob);
