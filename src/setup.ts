import {
  gerarCertificado,
  gerarChavesAssimetricas,
  salvarArquivo,
} from "./lib.js";

const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
  gerarChavesAssimetricas();

const certificadoDaAlice = gerarCertificado("alice", chavePublicaDaAlice);

salvarArquivo("certificado_da_alice.json", JSON.stringify(certificadoDaAlice));
salvarArquivo(
  "chave_privada_da_alice.json",
  JSON.stringify(chavePrivadaDaAlice),
);

const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
  gerarChavesAssimetricas();

const certificadoDoBob = gerarCertificado("bob", chavePublicaDoBob);

salvarArquivo("certificado_do_bob.json", JSON.stringify(certificadoDoBob));
salvarArquivo("chave_privada_do_bob.json", JSON.stringify(chavePrivadaDoBob));
