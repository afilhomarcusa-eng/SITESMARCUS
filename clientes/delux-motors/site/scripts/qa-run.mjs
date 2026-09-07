/**
 * Sobe o build de produção numa porta própria, roda o QA e derruba o servidor.
 *
 * O build acontece com nenhum servidor em pé. Reconstruir por baixo de um
 * servidor de produção rodando deixa a pasta de saída inconsistente, e o
 * sintoma engana: o HTML continua carregando enquanto a folha de estilo passa
 * a dar erro, então a página aparece sem estilo nenhum e qualquer medida
 * tirada depois disso está errada.
 */

import { spawn } from "node:child_process";
import { setTimeout as esperar } from "node:timers/promises";
import { readFileSync } from "node:fs";

const PORTA = process.env.QA_PORTA ?? "3310";
const BASE = `http://127.0.0.1:${PORTA}`;
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function rodar(cmd, args, opcoes = {}) {
  return new Promise((ok, erro) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opcoes });
    p.on("exit", (c) => (c === 0 ? ok() : erro(new Error(`${cmd} saiu com ${c}`))));
    p.on("error", erro);
  });
}

/**
 * Mata qualquer coisa que já esteja segurando a porta.
 *
 * Sem isto, um servidor sobrando de uma execução anterior continua respondendo,
 * o servidor novo nem sobe, e o QA acaba medindo o build velho enquanto os
 * pedaços novos voltam 500. O sintoma engana: parece defeito do site.
 */
async function liberarPorta() {
  await new Promise((ok) => {
    const cmd =
      process.platform === "win32"
        ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${PORTA} ^| findstr LISTENING') do taskkill /F /PID %a`
        : `lsof -ti tcp:${PORTA} | xargs -r kill -9`;
    const p = spawn(cmd, { stdio: "ignore", shell: true });
    p.on("exit", ok);
    p.on("error", ok);
  });
  await esperar(700);
}

async function noAr() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE, { method: "HEAD" });
      if (r.ok || r.status < 500) return true;
    } catch {
      /* ainda subindo */
    }
    await esperar(500);
  }
  return false;
}

/** Lê ADMIN_SENHA do ambiente ou do .env.local, que é o que o next start usa. */
function senhaAdmin() {
  if (process.env.ADMIN_SENHA) return process.env.ADMIN_SENHA;
  try {
    const texto = readFileSync(".env.local", "utf8");
    const achou = texto.match(/^ADMIN_SENHA=(.*)$/m);
    return achou ? achou[1].trim() : "";
  } catch {
    return "";
  }
}

const pular = process.argv.includes("--sem-build");
let servidor;

try {
  await liberarPorta();

  if (!pular) {
    console.log("\n  build de produção, sem servidor no ar\n");
    await rodar(npm, ["run", "build"]);
  }

  console.log(`\n  subindo em ${BASE}\n`);
  servidor = spawn(npx, ["next", "start", "-p", PORTA], {
    stdio: "ignore",
    shell: true,
    detached: process.platform !== "win32",
  });

  if (!(await noAr())) throw new Error("o servidor não subiu a tempo");

  // Confere que quem está respondendo é o build recém-gerado, e não sobra de
  // execução anterior. Medir o servidor errado é pior que não medir.
  const marca = await (await fetch(BASE + "/")).text();
  if (!marca.includes("Comprar, vender")) {
    throw new Error("quem respondeu na porta não é este site");
  }

  // A senha da gerência vem do .env.local, igual ao servidor de produção. Sem
  // ela o QA não conseguiria abrir /admin, que é metade do fluxo do cliente.
  await rodar("node", ["scripts/qa.mjs"], {
    env: { ...process.env, QA_BASE: BASE, ADMIN_SENHA: senhaAdmin() },
  });
} finally {
  if (servidor?.pid) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(servidor.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      try {
        process.kill(-servidor.pid);
      } catch {
        servidor.kill("SIGTERM");
      }
    }
  }
}
