# Prompt de site de cliente

Documento único. Quem recebe isto consegue começar um site do zero ou continuar um site parado sem precisar de mais nada além do BRIEFING preenchido.

---

## 1 · Onde você está

Pasta de produção de sites. Um site por cliente, cada um com Next.js próprio.

```
SITES/
├── _modelos/BRIEFING.md          modelo interno, nunca preencher aqui
├── _modelos/BRIEFING-CLIENTE.md  o que vai pro cliente responder
├── _modelos/PROMPT-SITE.md       este arquivo
├── clientes/<nome>/
│   ├── BRIEFING.md               cópia preenchida, fonte da verdade
│   ├── assets/                   logo, fotos, material do cliente
│   └── site/                     o Next.js
├── motion-primitives-website/    biblioteca, 155 componentes. Só leitura
└── .claude/skills/
```

Cada site tem porta própria no `package.json`. `node_modules` e `.next` não são versionados.

---

## 2 · Antes de escrever a primeira linha

1. Ler o `BRIEFING.md` do cliente inteiro. Ele manda em tudo que vem depois.
2. Se o site já existe, rodar `npm run build`. Se não passa, o primeiro trabalho é fazer passar.
3. Ler o `app/globals.css` e o `lib/data.ts` que já estiverem lá. O CSS costuma descrever componentes que ainda não foram escritos, e as classes dele são a especificação do markup que falta.
4. Listar o que está vazio no briefing, dizer qual padrão vai assumir, seguir sem esperar resposta.

Site parado no meio se retoma pelo que não compila, não pelo que é mais bonito de fazer.

---

## 3 · Dado

**Dado de contato nunca é inventado.** Sem telefone no briefing, não existe botão de telefone. Sem `@`, não existe botão de Instagram. Zero `(00) 00000-0000`, zero "Rua Exemplo, 123", zero depoimento fictício, zero número redondo sem origem.

**Dado de negócio mora em `lib/data.ts`.** Endereço, horário, unidade, categoria, link. Cada registro carrega a fonte de onde veio. O que ainda não foi confirmado fica em `pendingBusinessData`, visível no arquivo, e o site trata a ausência em vez de preencher:

```ts
hours: null as string | null
// no componente
{unit.hours ?? "Horários não confirmados. Pergunte pelo WhatsApp antes de sair de casa."}
```

**Rótulo que depende do dado sai do dado.** Contagem se conta com `length`. Nada de "Ver as duas" escrito à mão, porque um dia entra a terceira. Rótulo de fonte é campo do registro, porque "conforme o site do shopping" fica errado na loja de rua.

**Campo vazio não trava.** Aplicar o padrão da tabela do Bloco 10 do briefing, avisar qual assumiu, seguir.

---

## 4 · Componente

Antes de escrever qualquer componente de UI, procurar em `motion-primitives-website/src/components/`. São 155, divididos em backgrounds, buttons, cards, effects, interactive, layout, navigation, scroll, text, transitions.

Copiar o `.tsx` para o projeto do cliente. Não reescrever do zero, não instalar biblioteca concorrente, não editar o original. Deixar um comentário dizendo de onde veio.

`aurora`, `gradient-mesh`, `meteors` e `particles` existem na biblioteca e são exatamente a cara de IA. Só usar se o briefing pedir.

---

## 5 · Ordem de construção

1. Tokens em `globals.css`. Nenhum valor hardcoded depois disso.
2. Página inteira estática, sem uma animação.
3. Copy definitiva.
4. Humanizer.
5. Motion por último, uma seção por vez.

---

## 6 · Anti padrão de IA

Nada disto passa:

Gradiente roxo pra azul. Inter, Poppins ou Montserrat como fonte principal. Grid de três cards com ícone em quadradinho. Hero centralizado com botão cheio ao lado de vazado. Mesmo raio de borda em tudo. Espaçamento vertical uniforme entre seções. Emoji como ícone. Travessão no texto.

Palavras proibidas: descubra, transforme, eleve, potencialize, jornada, solução completa, excelência.

---

## 7 · Erros que já aconteceram

Cada linha custou retrabalho em site de cliente.

**Ícone é SVG, sempre.** Nenhum caractere decorativo no markup. `✳ ✦ ★ ✱ ✷` aparecem certinhos no desktop e viram emoji colorido no Android e no iOS. Vale para separador de faixa, marcador de mapa, seta e bullet. Se o CSS já tem regra do tipo `.marca svg{width:21px}`, é porque ali era para ter desenho e não caractere.

**`<img>` com `width` e `height` mais largura em CSS pede `height:auto`.** Sem isso o atributo continua mandando na altura e a imagem estica. Visível só no celular, onde o elemento é menor.

**`<br/>` escondido no mobile come o espaço.** `empório.<br/>Para` vira `empório.Para` quando a media query faz `br{display:none}`. Escrever `empório.{" "}<br/>Para`.

**Numeração de seção escrita à mão quebra.** Tirar a seção 04 obriga a renumerar 05, 06 e 07. Ao remover uma seção, procurar quem apontava para a âncora dela, ou o link morre em silêncio.

**Overlay que depende de JS precisa de saída.** Preloader ou cortina renderizada no servidor tapa o site inteiro se o JS falhar:

```jsx
<noscript><style>{".preloader{display:none}"}</style></noscript>
```

**Controle de biblioteca colide com overlay próprio.** O zoom do Leaflet nasce no canto superior esquerdo, em cima de qualquer selo posto ali. Escolher o canto na criação do mapa.

**Projeto que para no meio tem que compilar.** Se a sessão acabar, `npm run build` precisa passar, ou o que falta fica anotado no BRIEFING.

**`package.json` não aponta para script que não existe.**

---

## 8 · Motion

Nunca mais de dois tipos de animação juntos. Durações entre 400ms e 800ms. Nada reanima no scroll de volta. Zero movimento no fechamento.

`prefers-reduced-motion` desliga tudo, e isso inclui preloader, marquee e mapa que voa de um ponto a outro. Testar a regra, não só escrevê-la.

Marquee de verdade é duas trilhas idênticas e `translateX(-100%)`, com pausa no hover. Trilha única com `justify-content:space-around` não roda.

Preloader só se o briefing pedir. Quando existir: curto, uma vez por sessão em `sessionStorage`, com a marca do cliente, e com a saída do `<noscript>`.

---

## 9 · Copy

Tom "você". Frase de comprimento variado. Cada benefício tem número ou é cortado. Headline nomeia resultado.

Passa no humanizer antes de qualquer seção ser considerada pronta.

---

## 10 · Acessibilidade

Contraste mínimo 4.5:1. Foco visível. Alvo de toque de 44px. Alternativa em texto para o que é só imagem. `alt` que descreve a foto, e que diz "imagem ilustrativa" quando for.

Aba, tablist e painel com `role`, `aria-selected` e `aria-controls`. Navegação por seta em grupo de abas.

Mapa, carrossel e qualquer coisa que se arrasta precisa de dica visível de que se arrasta, e de caminho alternativo para quem não arrasta.

---

## 11 · Rodar

```bash
cd clientes/<nome>/site
npm install          # primeira vez na máquina
npm run dev          # trabalhar
npm run typecheck
npm run build && npm start   # ver o que vai ao ar
```

`npm start` serve o build. Mudou o código, build de novo e reinicia o processo, senão você olha para a versão velha e acha que a correção não pegou.

---

## 12 · QA obrigatório

Feito no navegador, antes de dizer que terminou. Desktop a 1440px e celular a 390px.

No celular, seção por seção, não a home inteira reduzida. Foi assim que passaram despercebidos um logo esticado, um espaço comido entre frases e um asterisco virando emoji verde.

Conferir em cada tamanho:

```
[ ] Nenhum caractere virou emoji
[ ] Nenhuma imagem esticou
[ ] Nenhuma frase perdeu espaço na quebra
[ ] Nenhum controle de mapa ou carrossel em cima de outro elemento
[ ] Nenhuma rolagem horizontal
[ ] Todo link de âncora chega em algum lugar
[ ] O que se arrasta avisa que se arrasta
```

---

## 13 · Publicar

```bash
cd clientes/<nome>/site
npx vercel link --yes --project <nome>   # sem isso o projeto nasce com o nome da pasta, "site"
npx vercel --prod --yes
npx vercel inspect <url-do-deploy>       # mostra os alias de produção
```

Conferir a URL de produção respondendo 200 e servindo o conteúdo novo, não o build anterior.

`robots:{index:false}` no `layout.tsx` é o certo enquanto a URL é link de aprovação do cliente. Tirar quando virar oficial.

O deploy pela CLI sobe os arquivos da máquina, não do GitHub. Commitar na branch do cliente, senão o que está no ar não tem histórico.

---

## 14 · Checklist de aceite

Responder item por item antes de dizer que terminou. Caixa não marcada, consertar antes de entregar.

**Visual**
```
[ ] Zero gradiente roxo pra azul
[ ] Duas fontes distintas
[ ] Uma seção fora do grid
[ ] Raio de borda varia por tipo de elemento
[ ] Espaçamento vertical irregular
[ ] Nenhum emoji como ícone
[ ] Nenhum caractere decorativo fazendo papel de ícone
[ ] Diferença de 4x entre maior e menor texto
```

**Motion**
```
[ ] Nunca mais de dois tipos de animação juntos
[ ] Durações entre 400ms e 800ms
[ ] Nada reanima no scroll de volta
[ ] prefers-reduced-motion desliga tudo, preloader e marquee inclusive
[ ] Zero movimento no fechamento
```

**Copy**
```
[ ] Zero palavras da lista
[ ] Zero travessões
[ ] Comprimento de frase varia
[ ] Cada benefício tem número ou foi cortado
[ ] Headline nomeia resultado
[ ] Humanizer rodou
```

**Dados**
```
[ ] Telefone é link tel:
[ ] WhatsApp abre com mensagem pronta
[ ] Zero dado inventado
[ ] O que não foi confirmado aparece como pendente, não como texto genérico
[ ] Contagem e rótulo saem do dado
[ ] JSON LD com dados reais
```

**Técnico**
```
[ ] Funciona a 375px
[ ] Conferido em captura de 390px, seção por seção
[ ] Sem rolagem horizontal
[ ] Contraste mínimo 4.5:1
[ ] Imagens em WebP com width e height
[ ] height:auto em toda imagem de largura relativa
[ ] Nenhuma âncora aponta para seção que não existe
[ ] Numeração de seção confere depois de qualquer remoção
[ ] Overlay que depende de JS tem saída no noscript
[ ] npm run typecheck e npm run build passam
[ ] Title e meta description escritos à mão
```

---

## 15 · Como entregar

Dizer o que foi feito, onde está rodando, e o que ficou de fora com o motivo. Separar o que é decisão de projeto do que é dado faltando do cliente.

Não anunciar como pronto o que não foi aberto no navegador.
