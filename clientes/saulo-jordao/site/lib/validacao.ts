import type { Carro } from "./tipos";
export function validarCarros(valor: unknown): string | null {
 if (!Array.isArray(valor)) return "Lista de carros ausente.";
 const usados = new Set<string>();
 for (const item of valor) {
  if (!item || typeof item !== "object") return "Carro inválido.";
  const c = item as Carro;
  if (typeof c.slug !== "string" || !/^[a-z0-9-]{2,60}$/.test(c.slug)) return "Endereço do carro inválido.";
  if (usados.has(c.slug)) return "Dois carros com o mesmo endereço.";
  usados.add(c.slug);
  if (![c.marca,c.modelo,c.nome].every(v=>typeof v==="string" && v.trim())) return "Preencha marca, modelo e nome.";
  if (!Number.isInteger(c.ano) || c.ano < 1886 || c.ano > new Date().getFullYear()+2) return "Ano inválido.";
  if (typeof c.preco !== "number" || !Number.isFinite(c.preco) || c.preco <= 0) return "Informe um preço válido.";
  if (![c.conferido,c.itens].every(a=>Array.isArray(a)&&a.every(v=>typeof v==="string"))) return "Ficha inválida.";
  for (const v of [c.km,c.potencia]) if(v!==undefined && (typeof v!=="number" || !Number.isFinite(v) || v<0)) return "Quilometragem ou potência inválida.";
  if (!Array.isArray(c.fotos) || c.fotos.length < 1 || c.fotos.length > 6) return "Adicione de uma a seis fotos antes de publicar.";
  for (const f of c.fotos) {
   if (!f?.nativa || !(f.nativa.w>0) || !(f.nativa.h>0) || !Array.isArray(f.fontes) || !f.fontes.length) return "Foto inválida.";
   for(const fonte of f.fontes) {
    const url=fonte?.url;
    const localTeste=!process.env.VERCEL && !!process.env.ESTOQUE_TESTE_DIR && typeof url==="string" && url.startsWith("data:image/webp;base64,");
    if (!Number.isInteger(fonte?.w) || fonte.w<=0 || fonte.w>f.nativa.w || typeof url!=="string" || (!localTeste && !/^\/images\/[a-zA-Z0-9._-]+$/.test(url) && !/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//.test(url))) return "Arquivo de foto inválido.";
   }
  }
 }
 return null;
}
