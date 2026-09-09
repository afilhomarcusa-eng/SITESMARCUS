# Thadeu Melo Team

Site do clube de corrida da Thadeu Melo Team, em Aracaju (SE). Next.js 16, App
Router, TypeScript, CSS próprio com tokens. Sem dependência de animação: o
movimento é CSS mais um único laço de `requestAnimationFrame`.

Duas páginas: `/` e `/cadastro`.

## Comandos

```bash
npm install
npm run dev        # http://127.0.0.1:3012
npm run build
npm run start      # precisa estar rodando para o qa
npm run typecheck
npm run lint
npm run assets     # regera recortes, grão e fontes a partir de ../assets
npm run qa         # Playwright: 8 larguras, cortina, movimento reduzido, sem JS
```

O `npm run qa` sobe contra `npm run start` já no ar e grava tudo em `qa-output/`.
Ele falha se aparecer erro de console, estouro horizontal, link quebrado,
conteúdo preso invisível, travessão na copy ou cortina repetindo na sessão.
Também falha se algum CTA de conversa sair do WhatsApp do clube, se alguma foto
for desenhada maior do que a origem que existe, se a mesma foto aparecer duas
vezes na página, ou se o CTA do herói estiver apagado ou não abrir o formulário
em qualquer momento da abertura.

O `/cadastro` tem checagem própria: os seis campos existem, a página não estoura
na horizontal em 1440 nem em 390, e o botão monta a mensagem com o número do
clube, o nome digitado e o local escolhido dentro dela.

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| WhatsApp, Instagram, cidade, locais, horários, FAQ, fotos | `lib/content.ts` |
| Números, linha do tempo e passos da seção 03 | `lib/content.ts` (`stats`, `timeline`, `steps`) |
| Opções do formulário | `lib/content.ts` (`signup`) |
| Todo o texto de seção, títulos e chamadas | `app/page.tsx` |
| A página de cadastro | `app/cadastro/page.tsx` e `components/signup-form.tsx` |
| Cores, espaçamento, tempos, curvas, cena espacial | `app/globals.css` (`:root` no topo) |
| Título, descrição, Open Graph, dados estruturados | `app/layout.tsx` e `app/page.tsx` |
| Imagens geradas e o ladrilho de grão | `public/images/` |
| Fontes servidas (woff2) | `public/fonts/`, originais em `../assets/fonts/` |

Nenhum endereço ou preço aparece no site porque nada disso foi confirmado.
Toda conversa começa no WhatsApp (`club.whatsapp`, em `lib/content.ts`); o
Instagram ficou só para acompanhar o dia a dia. Trocar o número em um lugar
troca em todos os CTAs, e o `qa` falha se sobrar link de conversa fora dele.

O número tinha oito dígitos depois do DDD e celular brasileiro tem nove: todo
CTA do site apontava para `wa.me/557998276343`, que não existe. O número
confirmado pelo clube é **+55 79 99827-6343**, e o link agora já leva a primeira
mensagem escrita. O `qa` confere os dois: número inteiro e mensagem presente.

Quando chegar endereço confirmado, ele entra nesse arquivo e o
`SportsOrganization` em `app/page.tsx` ganha `address` completo.

## Imagens

Seis fotos, uma por lugar, cada uma de um arquivo próprio. A tabela `photos` no
topo de `scripts/prepare-assets.mjs` guarda, para cada uma, a origem em
`assets/`, a proporção da caixa onde ela é desenhada e a maior largura em pixels
de layout que ela ocupa (`css`).

```bash
npm run assets     # recortes, ladrilho de grão e as fontes em woff2
```

A regra do gerador é uma só: **nenhum arquivo sai maior do que a origem**. A
largura de saída é `min(css * 2, largura nativa do recorte)`, com recorte e
redução na mesma chamada do `sharp` (dois `resize` em sequência descartariam o
enquadramento), lanczos3, e máscara de nitidez só quando houve redução. O
`public/images/manifest.json` guarda a conta, e é ele que o `npm run qa` lê para
reprovar qualquer foto desenhada acima da origem.

| Foto | Origem | Onde aparece |
| --- | --- | --- |
| `orla-corrida` | Atlet | herói, painel de altura cheia |
| `pista-vertical` | Unit | 01, coluna vertical |
| `pista-dupla` | Unit | 02, ao lado do título |
| `pista-grupo` | Unit | 03, o quadro grande |
| `equipe-2018` | arquivo do clube, 2018 | 03, o quadro pequeno |
| `pista-solo` | Unit | 04, fecha a coluna |
| `pista-largada` | Unit | `/cadastro` |

**Se mudar o tamanho de uma foto no CSS, atualize o `css` daquela linha.**

O grão também sai desse script, como ladrilho rasterizado. Antes era um SVG com
`feTurbulence` esticado até o tamanho do elemento, refeito pelo navegador a cada
quadro em que a cena do herói se mexia: sozinho, respondia por cerca de um quarto
do custo de rolagem do herói.

### O que mudou, e por quê

A primeira versão tirava as quinze imagens da página de **um único negativo de
850x566**, ampliado até 1700px de arquivo. Era isso que deixava tudo mole e
repetido: a mesma barraca aparecia quatro vezes na tira de arquivo, mais duas na
seção 01, mais três no painel de horários. A checagem de imagem do `qa` não
pegava porque comparava a caixa com o arquivo entregue, e o arquivo era grande
justamente por ter sido ampliado. Agora ela compara com a origem.

O painel de cada local em `02` deixou de carregar foto e passou a mostrar a
semana do local escolhido, que é informação que o clube tem de verdade.

A `03` era uma cena com câmera: uma foto crescendo ao longo de 168vh de rolagem.
Em tela larga isso virava um campo de petróleo vazio com um retrato pequeno no
canto. Hoje ela é a seção mais densa da página, e o que a enche tem fonte: os
números saem de `locations` (se um horário mudar, eles mudam junto), a linha do
tempo aponta para a matéria de 2018 e para a cobertura da Unit, e os três passos
levam ao formulário.

O herói era o título em duas palavras gigantes com a foto num porta-retrato
girado entre elas, tudo em planos com Z. A foto precisava ser pequena para não
esticar e a composição não sobrevivia a uma tela de 1920. Agora são duas colunas
mais uma faixa: mensagem e ações à esquerda, a corrida em altura cheia à direita
e os três pontos de treino embaixo, antes de qualquer rolagem.

Só uma das sete fotos é do clube. As outras cinco são de coberturas públicas
(Atlet, e o Desafio Tiradentes na Unit), com crédito na legenda e o link da
fonte na própria página. **Quando o clube mandar fotos próprias**, é trocar a
origem na tabela `photos` do script, rodar `npm run assets`, atualizar
`w`/`h`/`alt`/`caption` em `photos` no `lib/content.ts` e apagar
`.next/cache/images` (o otimizador do Next guarda variantes antigas com o mesmo
nome de arquivo). A ordem de prioridade, pelo tamanho que ocupam: o herói, o
quadro grande da `03` e a coluna da `01`.

O logotipo oficial em alta está em `assets/adepol-thadeu.png` (1024x599) e ainda
não é usado: o wordmark do cabeçalho continua sendo desenhado em CSS.

## O cadastro

O clube não tem servidor, e um "enviado com sucesso" que não envia nada seria
pior do que não ter formulário. Então `/cadastro` monta a mensagem e abre a
conversa no WhatsApp do clube com tudo escrito: a pessoa lê antes de enviar e a
equipe recebe as respostas organizadas, sempre no mesmo formato.

São seis campos, quatro deles em botão de escolha única para responder no
polegar. As opções ficam em `signup`, no `lib/content.ts`, e os locais saem de
`locations`, então a lista do formulário nunca desencontra da agenda do site.

Quando existir um destino de verdade para os dados (uma planilha, um e-mail, um
CRM), o lugar de plugar é o `onSubmit` de `components/signup-form.tsx`: ele já
tem todas as respostas em mãos antes de montar o texto.

## Publicação

Defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) antes do build de produção.
Sem essa variável o site sai com `noindex`, de propósito, para nenhuma versão de
teste entrar no Google.
