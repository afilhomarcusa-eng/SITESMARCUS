# SITES

Pasta de produção de sites para clientes. Um site por cliente, cada um com Next.js próprio.

## Estrutura

```
SITES/
├── _modelos/BRIEFING.md          modelo interno, nunca preencher aqui
├── _modelos/BRIEFING-CLIENTE.md  o que vai pro cliente responder
├── _modelos/PROMPT-SITE.md       prompt completo, tudo que o agente precisa saber
├── clientes/<nome>/              um por cliente
│   ├── BRIEFING.md               cópia preenchida
│   ├── assets/                   logo, fotos, material do cliente
│   └── site/                     o Next.js
├── motion-primitives-website/    biblioteca. Só leitura, nunca editar
└── .claude/skills/               skills compartilhadas
```

## Máquina nova

```bash
git clone https://github.com/afilhomarcusa-eng/SITESMARCUS.git
cd SITESMARCUS/clientes/<nome>/site && npm install
```

O `node_modules` e o `.next` não são versionados, então cada site precisa de um
`npm install` no primeiro uso.

A `motion-primitives-website` está aqui sem o histórico git dela, de propósito,
porque eram 578 MB. Para atualizar a biblioteca no futuro, clone de novo a partir
de `https://github.com/itsjwill/motion-primitives-website.git` e substitua a pasta.

## Site novo

```bash
cp -r _modelos/BRIEFING.md clientes/<nome>/BRIEFING.md
mkdir -p clientes/<nome>/assets
cd clientes/<nome>
npx create-next-app@latest site --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd site && npm i motion
```

Depois preenche o BRIEFING e me manda.

## Os dois briefings

`_modelos/BRIEFING-CLIENTE.md` é o que o cliente recebe, colado direto no WhatsApp. O
arquivo inteiro é a mensagem, sem cabeçalho nem instrução: é só copiar tudo e enviar. Os
`*asteriscos*` viram negrito sozinhos lá. Nove perguntas, três delas travam o começo
(WhatsApp, cidade e fotos), montadas a partir do que de fato travou o site da Clara.

Não crescer esse arquivo. A primeira versão tinha 148 linhas e foi recusada por isso:
briefing que parece formulário de cartório não volta respondido.

`_modelos/PROMPT-SITE.md` é o prompt completo. Serve para abrir sessão em site novo ou para retomar site parado sem depender do histórico de conversa. Toda regra desta pasta está lá dentro.

`_modelos/BRIEFING.md` é interno. Proibições visuais, coreografia de scroll, regras de copy
e a tabela do Bloco 10. O cliente nunca vê esse. Ele é preenchido com as respostas do outro
mais as decisões de projeto.

## Regras que valem para todo site desta pasta

**Componente vem da biblioteca.** Antes de escrever qualquer componente de UI, procurar em `motion-primitives-website/src/components/`. São 155 componentes em backgrounds, buttons, cards, effects, interactive, layout, navigation, scroll, text, transitions. Copiar o `.tsx` para o projeto do cliente. Não reescrever do zero, não instalar biblioteca concorrente, não editar o original.

**O BRIEFING do cliente é a fonte da verdade.** Ele traz a lista de proibições visuais, a coreografia de scroll, as regras de copy e a tabela de padrão quando um campo está vazio. Ler ele inteiro antes de codar.

**Campo vazio não trava.** Aplicar o padrão da tabela do Bloco 10 do briefing, avisar qual padrão foi assumido, seguir sem esperar resposta.

**Dado de contato nunca é inventado.** Sem telefone no briefing, não existe botão de telefone. Sem `@`, não existe botão de Instagram. Zero placeholder do tipo `(00) 00000-0000` ou "Rua Exemplo, 123". Zero depoimento fictício, zero número redondo sem origem.

**Ordem de construção:** tokens em `globals.css`, página estática inteira, copy definitiva, humanizer, motion por último.

**Dado de negócio mora em `lib/data.ts`.** Endereço, horário, telefone, unidade, categoria. O que ainda não foi confirmado fica marcado no próprio arquivo, em `pendingBusinessData`, com a fonte de cada dado que entrou. Componente não guarda dado solto.

**Copy passa no humanizer** antes de qualquer seção ser considerada pronta.

**Nunca `-g` ou `--global` ao instalar skill.** Sempre no projeto.

## Anti padrão de IA, resumo

O briefing detalha. O essencial que não passa em nenhum site:

Gradiente roxo pra azul. Inter, Poppins ou Montserrat como fonte principal. Grid de 3 cards com ícone em quadradinho. Hero centralizado com botão cheio ao lado de vazado. Mesmo raio de borda em tudo. Espaçamento vertical uniforme entre seções. Emoji como ícone. Travessão no texto. As palavras descubra, transforme, eleve, potencialize, jornada, solução completa, excelência.

Os componentes `aurora`, `gradient-mesh`, `meteors` e `particles` existem na biblioteca e são exatamente esse visual. Só usar se o briefing pedir.

## Erros que já aconteceram

Cada linha aqui custou retrabalho em site de cliente. Ler antes de codar.

**Ícone é SVG, sempre.** Nenhum caractere decorativo no markup. `✳ ✦ ★ ✱ ✷` aparecem certinhos no desktop e viram emoji colorido no Android e no iOS. Vale para separador de faixa, marcador de mapa, seta e bullet. Se o CSS já tem regra do tipo `.marca svg{width:21px}`, é porque ali era para ter desenho e não caractere.

**`<img>` com `width` e `height` mais largura em CSS pede `height:auto`.** Sem isso o atributo continua mandando na altura e a imagem estica. Aconteceu com um logo dentro de uma sacola, visível só no celular.

**`<br/>` escondido no mobile come o espaço.** `empório.<br/>Para` vira `empório.Para` quando a media query faz `br{display:none}`. Escrever `empório.{" "}<br/>Para`.

**Texto que depende de dado sai do dado.** "Ver as duas" quebrou quando entrou a terceira unidade. "Endereço conforme o site do shopping" ficou errado na loja de rua. Contagem se conta com `length`, rótulo de origem vem no registro.

**Numeração de seção escrita à mão quebra.** Tirar a seção 04 obriga a renumerar 05, 06 e 07. Ao remover, conferir também quem apontava para a âncora dela, ou o link morre em silêncio.

**Overlay que depende de JS precisa de saída.** Preloader ou cortina renderizada no servidor tapa o site inteiro se o JS falhar. `<noscript><style>{".preloader{display:none}"}</style></noscript>` resolve.

**Controle de biblioteca colide com overlay próprio.** O zoom do Leaflet nasce no canto superior esquerdo, em cima de qualquer selo posto ali. Escolher o canto na hora de criar o mapa, não depois.

**QA é em tamanho de celular, seção por seção.** Os três primeiros defeitos desta lista passaram no desktop. Capturar a 390px e olhar bloco por bloco, não só a home inteira reduzida.

**Projeto que para no meio tem que compilar.** Se a sessão acabar, `npm run build` precisa passar, ou o que falta fica anotado no BRIEFING. Página importando cinco componentes que não existem custa caro para quem pega depois.

**`package.json` não aponta para script que não existe.** Um `"qa": "node scripts/qa.mjs"` sem o arquivo é promessa quebrada.

---

## Rodar e publicar

Cada cliente tem porta própria no `package.json`. `npm run dev` para trabalhar, `npm run build` mais `npm start` para ver o que vai ao ar. Mudou o código, o `npm start` não recarrega sozinho: build de novo e reinicia o processo.

```bash
cd clientes/<nome>/site
npx vercel link --yes --project <nome>   # sem isso o projeto nasce com o nome da pasta, "site"
npx vercel --prod --yes
npx vercel inspect <url-do-deploy>       # mostra os alias de produção
```

`robots:{index:false}` no `layout.tsx` é o certo enquanto a URL é link de aprovação do cliente. Tirar quando virar o site oficial.

Deploy pela CLI sobe os arquivos da máquina, não do GitHub. Site publicado sem commit fica sem histórico, então commitar na branch do cliente antes ou logo depois.

---

## Skills disponíveis

`ui-ux-pro-max` para decisão de tipografia, paleta e layout. `design-system` para tokens. `brand` para voz. `humanizer` para copy. `agent-browser` para analisar sites de referência.

A `huashu-design` força mostrar 3 direções antes de executar e conflita com o fluxo do briefing. Ignorar em sites de cliente.
