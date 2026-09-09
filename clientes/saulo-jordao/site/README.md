# Saulo Jordão Premium Cars

Site em Next.js 16 e TypeScript. Cinco destinos públicos: início, estoque, ficha do carro, procura e venda. O painel `/admin` é protegido por senha.

## Executar

```bash
npm install
npm run dev
npm run build
npm start
```

Prévia local: http://127.0.0.1:3014

## Gerenciar o estoque

Abra `/admin`. A autenticação usa a variável de servidor `ADMIN_SENHA`. O estoque e as fotos são persistidos no Vercel Blob, configurado com `BLOB_READ_WRITE_TOKEN`. Credenciais nunca devem ser colocadas em variáveis `NEXT_PUBLIC_*`.

- Adicionar carro: preencha marca, modelo, nome, ano, preço e pelo menos uma foto; depois salve.
- Editar: selecione o carro, altere os campos e clique em **Salvar no site**.
- Remover: retire o carro da lista e salve. Remover todos deixa o estoque vazio, sem restaurar anúncios antigos.
- Restaurar a lista original: pede confirmação e substitui a lista pela semente de 08/09/2026. O painel atualiza sem recarregar.
- As alterações de texto são gravadas ao salvar. Fotos são enviadas assim que selecionadas.
- Falhas de conexão preservam a edição e liberam uma nova tentativa.

Cada salvamento gera uma versão imutável do estoque. As cinco versões mais recentes ficam no Blob. Fotos substituídas recebem URLs novas para evitar o cache da imagem anterior.

## Arquivos principais

| Conteúdo | Arquivo |
| --- | --- |
| Estoque original | `lib/semente.ts` |
| Leitura, gravação e upload | `lib/banco.ts` |
| Validação antes de publicar | `lib/validacao.ts` |
| Painel | `components/gerencia.tsx` |
| Contato e dados da empresa | `lib/contato.ts` |
| Formulários e mensagens | `lib/formularios.ts`, `lib/mensagens.ts` |
| Abertura com faróis | `components/cortina.tsx`, `lib/abertura.ts` |
| Seletor dos três caminhos | `components/caminhos.tsx` |
| Tipografia e estilos | `app/globals.css`, `app/layout.tsx` |

A quantidade de carros, as marcas, a faixa de preços e o destaque da home são calculados a partir do estoque salvo. Não edite a contagem manualmente.

## Fotografias

As fotos de veículos vêm dos anúncios originais. O retrato de Saulo foi recuperado da [página oficial Quem somos](https://www.saulojordao.com/quem-somos), arquivo `635685_b8a64c8a058147f38c68ce512a903377~mv2.jpg`.

O original está em `../assets/saulo-original.jpg`, com 900 × 1600 pixels. O recorte usa 900 × 1200 pixels e gera versões de 420 e 840 pixels, sem ampliação. As fotos do estoque ficam em `../assets/carros`.

`npm run assets` regenera os arquivos em `public/images` e o manifesto de dimensões. O upload administrativo reduz fotos grandes no navegador antes do envio, corrige a orientação EXIF no processamento e limita a saída à dimensão útil do recorte.

## Verificações

```bash
npm run typecheck
npm run lint
npm run qa
npm run qa:rapido
npm run perf
```

O QA cria um build separado em `.next-qa` e usa um banco local em `.qa-data`. A porta padrão é 3319. A senha é aleatória por execução e o token do Blob fica desativado. Ele não interrompe a prévia em 3014 e não escreve no estoque real.

`qa:rapido` reutiliza exclusivamente o build de QA anterior. Rode `qa` depois de alterações no site.

As verificações cobrem oito larguras, imagens, copy, links, formulários, filtros, teclado, abertura, movimento reduzido, ausência de JavaScript, autenticação, cadastro, edição, upload, remoção, estoque vazio, restauração e falha de rede. Resultados e capturas ficam em `qa/`.

`npm run perf` mede a prévia em 3014; use `PERF_BASE` para outra URL. Medições locais não equivalem a Lighthouse móvel ou métricas de usuários reais.

## Publicação

O projeto Vercel existente é `saulo-jordao`. Antes de publicar, configure as variáveis de servidor e defina `NEXT_PUBLIC_SITE_URL` com o domínio escolhido. O fallback é `https://saulo-jordao.vercel.app`.

O site permanece com `index: false` enquanto estiver em aprovação. Para indexar o domínio definitivo, atualize `app/layout.tsx` e `app/robots.ts`.

## Dados ainda pendentes

- Ficha técnica do Audi RS5, que não estava no anúncio.
- Endereço e horários, caso Saulo queira publicá-los.
- Confirmação periódica de disponibilidade e preços pelo responsável pelo estoque.

A versão anterior de abertura por diafragma e as métricas antigas não descrevem esta revisão. Consulte `qa/resultado.txt` para o resultado da última execução.
