import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

import {
  gerarCertificado,
  gerarChavesAssimetricas,
  salvarArquivo,
} from "./lib.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\n=== MENU ===");
  console.log("1. Gerar chaves e certificados");
  console.log("2. Executar Alice");
  console.log("3. Executar Bob");
  console.log("4. Sair\n");

  rl.question("Escolha uma opção: ", (resposta) => {
    switch (resposta) {
      case "1":
        gerar();
        break;
      case "2":
        runProgram("alice.js");
        break;
      case "3":
        runProgram("bob.js");
        break;
      case "4":
        rl.close();
        break;
      default:
        console.log("Opção inválida.");
        showMenu();
    }
  });
}

function gerar() {
  const { publicKey: chavePublicaDaAlice, privateKey: chavePrivadaDaAlice } =
    gerarChavesAssimetricas();
  const certificadoDaAlice = gerarCertificado("alice", chavePublicaDaAlice);

  salvarArquivo("certificado-alice.json", certificadoDaAlice);
  salvarArquivo("chave-privada-alice.pem", chavePrivadaDaAlice);

  const { publicKey: chavePublicaDoBob, privateKey: chavePrivadaDoBob } =
    gerarChavesAssimetricas();
  const certificadoDoBob = gerarCertificado("bob", chavePublicaDoBob);

  salvarArquivo("certificado-bob.json", certificadoDoBob);
  salvarArquivo("chave-privada-bob.pem", chavePrivadaDoBob);

  console.log("Chaves e certificados gerados e salvos na pasta './out/'.");
  showMenu();
}

function runProgram(arquivo) {
  const scriptPath = resolve(arquivo);

  const processo = spawn("node", [scriptPath], {
    stdio: "inherit",
  });

  processo.on("close", (code) => {
    console.log(`Processo ${arquivo} finalizado com código ${code}`);
    showMenu();
  });
}

showMenu();
