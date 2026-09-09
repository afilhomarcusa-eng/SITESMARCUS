/**
 * Endereço público do site.
 *
 * Enquanto não existe domínio próprio, a Vercel entrega a URL do deploy em
 * variável de ambiente. Sem isso, o metadataBase apontaria para um domínio
 * que ainda não existe e a prévia de link no WhatsApp viria sem imagem,
 * justamente onde este site mais circula.
 *
 * Quando o domínio entrar no ar, defina SITE_URL nas variáveis do projeto
 * (ou troque o padrão aqui) e nada mais precisa mudar.
 */
export function enderecoDoSite(): string {
  const proprio = process.env.SITE_URL;
  if (proprio) return proprio.replace(/\/$/, "");

  // Domínio estável de produção do projeto na Vercel.
  const producao = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (producao) return `https://${producao}`;

  // Deploy avulso (prévia).
  const deploy = process.env.VERCEL_URL;
  if (deploy) return `https://${deploy}`;

  return "http://localhost:3000";
}
