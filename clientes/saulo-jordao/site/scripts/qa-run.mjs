import { spawn } from "node:child_process";
import { setTimeout as esperar } from "node:timers/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
const porta = process.env.QA_PORTA ?? "3319";
if (!/^\d+$/.test(porta)) throw new Error("Porta de QA inválida.");
const base = "http://127.0.0.1:" + porta;
const pasta = path.resolve(".qa-data");
await mkdir(pasta, {recursive:true});
await writeFile(path.join(pasta,"README.txt"), "Dados descartáveis do QA. O Blob de produção não é usado.\n");
const env = {...process.env, ESTOQUE_TESTE_DIR:pasta, NEXT_DIST_DIR:".next-qa", ADMIN_SENHA:randomBytes(24).toString("hex"), BLOB_READ_WRITE_TOKEN:"", VERCEL:"", QA_ISOLADO:"1", QA_BASE:base};
const next = path.resolve("node_modules/next/dist/bin/next");
function rodar(args){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,args,{env,stdio:"inherit",windowsHide:true});p.on("error",reject);p.on("exit",code=>code===0?resolve():reject(Error("Processo terminou com "+code)));});}
try {await fetch(base,{signal:AbortSignal.timeout(1000)});throw Error("A porta de QA já está ocupada. Use outra QA_PORTA.");}catch(e){if(e.message.includes("ocupada"))throw e;}
if(!process.argv.includes("--sem-build")) await rodar([next,"build"]);
let servidor;
try {
 servidor=spawn(process.execPath,[next,"start","--hostname","127.0.0.1","-p",porta],{env,stdio:["ignore","pipe","pipe"],windowsHide:true});
 let log="";servidor.stdout.on("data",b=>log+=b);servidor.stderr.on("data",b=>log+=b);
 let pronto=false;
 for(let i=0;i<90;i++){try{const r=await fetch(base);if(r.ok){pronto=true;break;}}catch{}await esperar(500);}
 if(!pronto)throw Error("Servidor não iniciou: "+log);
 await rodar(["scripts/qa.mjs"]);
} finally {servidor?.kill(); }
