import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

import {
  gerarChavesAssimetricas,
  gerarCertificado,
  salvarArquivo,
} from "./lib.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const BASE_PATH = path.resolve(ROOT_DIR, "out");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu() {
  console.log("\n=== MENU ===");
  console.log("1. Gerar chaves e certificados");
  console.log("2. Executar Alice");
  console.log("3. Executar Bob");
  console.log("4. Sair\n");

  rl.question("Escolha uma opção: ", (resposta) => {
    switch (resposta) {
      case "1":
        gerarChavesECertificados();
        break;
      case "2":
        executarPrograma("alice.js");
        break;
      case "3":
        executarPrograma("bob.js");
        break;
      case "4":
        rl.close();
        break;
      default:
        console.log("❌ Opção inválida.");
        menu();
    }
  });
}

function gerarChavesECertificados() {
  const { publicKey: alicePub, privateKey: alicePriv } = gerarChavesAssimetricas();
  const certificadoAlice = gerarCertificado("Alice", alicePub);

  salvarArquivo("certificado-alice.json", JSON.stringify(certificadoAlice, null, 2));
  salvarArquivo("chave-publica-alice.pem", alicePub);
  salvarArquivo("chave-privada-alice.pem", alicePriv);

  const { publicKey: bobPub, privateKey: bobPriv } = gerarChavesAssimetricas();
  const certificadoBob = gerarCertificado("Bob", bobPub);

  salvarArquivo("certificado-bob.json", JSON.stringify(certificadoBob, null, 2));
  salvarArquivo("chave-publica-bob.pem", bobPub);
  salvarArquivo("chave-privada-bob.pem", bobPriv);

  console.log("✔️ Chaves e certificados gerados e salvos na pasta 'out/'.");
  menu();
}

function executarPrograma(arquivo: string) {
  const scriptPath = path.resolve(BASE_PATH, arquivo);

  const processo = spawn("node", [scriptPath], {
    stdio: "inherit",
  });

  processo.on("close", (code) => {
    console.log(`Processo ${arquivo} finalizado com código ${code}`);
    menu();
  });
}


menu();
