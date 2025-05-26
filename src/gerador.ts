import readline from "readline";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

import {
  generateAsymmetricKeys,
  generateCertificate,
  saveFile,
} from "./lib.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const BASE_PATH = path.resolve(ROOT_DIR, "out");

const rl = readline.createInterface({
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
        generateKeysAndCertificates();
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
        console.log("❌ Opção inválida.");
        showMenu();
    }
  });
}

function generateKeysAndCertificates() {
  const { publicKey: alicePub, privateKey: alicePriv } = generateAsymmetricKeys();
  const certificadoAlice = generateCertificate("Alice", alicePub);

  saveFile("certificado-alice.json", JSON.stringify(certificadoAlice, null, 2));
  saveFile("chave-publica-alice.pem", alicePub);
  saveFile("chave-privada-alice.pem", alicePriv);

  const { publicKey: bobPub, privateKey: bobPriv } = generateAsymmetricKeys();
  const certificadoBob = generateCertificate("Bob", bobPub);

  saveFile("certificado-bob.json", JSON.stringify(certificadoBob, null, 2));
  saveFile("chave-publica-bob.pem", bobPub);
  saveFile("chave-privada-bob.pem", bobPriv);

  console.log("✔️ Chaves e certificados gerados e salvos na pasta 'out/'.");
  showMenu();
}

function runProgram(arquivo) {
  const scriptPath = path.resolve(BASE_PATH, arquivo);

  const processo = spawn("node", [scriptPath], {
    stdio: "inherit",
  });

  processo.on("close", (code) => {
    console.log(`Processo ${arquivo} finalizado com código ${code}`);
    showMenu();
  });
}

showMenu();
