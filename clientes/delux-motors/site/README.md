# Delux Motors

Site da loja de carros da Boca do Rio, em Salvador. Next.js 16, TypeScript,
Tailwind, um shader de céu em WebGL, Lenis para a rolagem.

## Rodar

```bash
npm install
npm run dev          # desenvolvimento em localhost:3000
npm run build        # build de produção
npm run qa           # build + navegador de verdade + 198 verificações
npm run perf         # LCP, CLS e peso, com o servidor já no ar
```

O `npm run qa` é o portão. Derruba o que estiver na porta, faz o build com
nenhum servidor no ar, sobe, confere que quem respondeu é este site, roda as
verificações e grava as telas em `qa/`. **As telas são para olhar.**

## As páginas

| Rota | Serve para |
|---|---|
| `/` | Página de venda: herói, os três serviços, estoque, a loja, como chegar, dúvidas |
| `/estoque` | O catálogo, separado, com busca, filtro e ordenação |
| `/estoque/[slug]` | Um carro |
| `/admin` | Gerência do estoque |

A home é organizada em torno de **três portas**, e não fui eu que decidi: as
três únicas publicações estáticas do Instagram deles são Compra, Venda e
Consignação, uma para cada. Numa loja assim, a maior parte de quem entra no site
não procura um carro específico, está decidindo qual das três portas é a dela.
Por isso os serviços vêm logo depois do herói, cada um com o próprio botão e a
própria mensagem já escrita no WhatsApp.

## O conceito

A única fotografia real da loja é a fachada em Boca do Rio no fim da tarde, com
o céu de Salvador aceso atrás. O site inteiro sai daí.

As cores não foram escolhidas, foram medidas nessa foto: o breu é a fachada
(`#08070A`), o malva é o céu alto (`#6B5A66`), a brasa é o horizonte
(`#F0C0A8`) e o cromo é o letreiro (`#D6D4C6`).

### A abertura

O horizonte nascendo. A tela começa no breu, a brasa sobe pela borda de baixo,
o céu assenta, a marca se apresenta no meio da tela e recolhe, e a loja aparece
embaixo do céu que já estava lá. Não existe corte entre abertura e herói: é a
mesma imagem em dois momentos. Roda uma vez por sessão e o primeiro gesto
encerra.

O céu é um shader porque um degradê desse tamanho em CSS mostra faixas: o
navegador interpola em 8 bits sem ruído. No shader o grão entra antes da
quantização e o degradê fica limpo. Se o WebGL não subir, existe um degradê de
CSS atrás que imita as duas camadas, inclusive a sombra da esquerda.

### O relógio da abertura vive em `lib/abertura.ts`

E isso não é organização, é desempenho. Na primeira versão quem contava o tempo
era o componente do céu, e o DOM esperava o aviso dele. O relógio só começava
depois que o pacote do three baixava, então o tempo de carregar a biblioteca
entrava inteiro na conta: **o LCP deu 4,2s**. Encurtar a sequência levou a 2,9s,
ainda reprovando.

Agora o relógio começa na montagem do herói e o céu acompanha por conta própria.
LCP medido: **284 ms**. O `npm run qa` mede o tempo até a loja aparecer a cada
execução, para não voltar a crescer em silêncio.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Telefone, endereço, horário, os três serviços | `lib/contato.ts` |
| Estoque inicial | `lib/carros.ts` |
| Persistência do estoque (**o banco entra aqui**) | `lib/estoque.ts` |
| Filtro, busca e ordenação | `lib/filtros.ts` |
| Tempo da abertura | `lib/abertura.ts` |
| Perguntas e respostas | `components/secao-duvidas.tsx` |
| Geração das imagens | `scripts/build-assets.mjs` |
| Verificações | `scripts/qa.mjs` |

Nenhum telefone, endereço ou horário aparece escrito solto dentro de componente.
O QA reconfere a forma do número a cada execução: celular brasileiro em formato
internacional tem 13 dígitos e o assinante começa com 9.

## Imagens

`npm run assets` regenera a partir de `../assets`.

A regra que manda: **nenhuma imagem sai maior do que entrou**. A largura
exportada é `min(slot * 2, largura nativa)`.

Este projeto tem exatamente uma fotografia, em 1200x1600. Ela é servida em 1200,
ou seja 1x, e a composição do herói foi desenhada em cima disso: painel retrato
à direita, com o céu do shader continuando o céu de dentro da foto. Esticar a
foto para preencher a tela entregaria borrão em qualquer monitor grande.

O manifesto em `public/images/manifest.json` guarda a dimensão **nativa** de
cada origem. O QA compara a caixa desenhada contra esse número, nunca contra o
arquivo exportado, porque um pipeline que amplia gera arquivo grande e passaria
feliz num teste que olhasse só o export. Por isso o projeto usa `<img>` e não
`next/image`.

## O estoque, e por que ele começa vazio

A Delux Motors não publica estoque em lugar nenhum. O Instagram tem doze
publicações: três artes institucionais e nove reels de conteúdo, sem uma única
ficha de carro. O domínio que eles anunciam no Google não resolve.

Inventar ficha, preço ou quilometragem para a página parecer cheia seria mentira
publicada em nome do cliente. Então `/estoque` mostra um estado vazio honesto que
continua vendendo: diz que o estoque gira, manda para o Instagram, oferece o
WhatsApp com a mensagem já escrita e apresenta as outras duas portas do negócio.

### Para encher

Cadastre em `/admin`, ou mande a lista para virar carga inicial em
`lib/carros.ts`. No momento em que existir carro, a página vira vitrine sozinha:
busca, filtro por marca, câmbio, combustível e faixa de preço, ordenação e
contagem. O estado dos filtros vive na barra de endereço, então uma seleção é um
link que pode ser mandado no WhatsApp.

### O banco

Troque as quatro funções de `lib/estoque.ts` (`lerTudo`, `gravarTudo`,
`lerFoto`, `gravarFoto`) por chamadas de API. Nenhum componente, nenhum campo e
nenhum formulário muda. Depois, ponha uma senha na frente de `/admin`, que hoje
está aberta e só marcada como `noindex`.

## O que o QA verifica

Estrutura em 8 larguras (360 a 1920), um único `h1`, imagens carregadas, console
limpo, nada devolvendo 400 ou mais, nenhuma revelação presa (na home e em
/estoque), nenhum título cortado pela própria caixa, a lei da resolução contra o
manifesto, nenhuma imagem repetida, travessão, sobra de inglês, palavra
duplicada, clichê proibido.

Conversão: cada um dos sete botões de WhatsApp conferido pelo próprio seletor, a
forma do telefone dígito a dígito, e **cada serviço abrindo a conversa com a
mensagem dele**, não com uma genérica.

Abertura: o botão do cabeçalho cheio e clicável em seis instantes, a loja
aparecendo em até 2,5s, abertura uma vez por sessão, movimento reduzido, sem
JavaScript, e **sem WebGL**.

Fluxo do cliente: a página de estoque vazia oferecendo as três portas, e
cadastrar um carro na gerência fazendo ele aparecer no estoque público, com o
preço formatado e a marca virando filtro.

Quando um defeito for corrigido, a verificação dele entra no mesmo passo. Foi
assim que entraram a do título cortado, a da revelação presa fora da home, a do
tempo até a loja aparecer e a do site sem WebGL.

## O defeito que quase passou

O pacote do three falhou ao carregar numa medição e **o herói inteiro ficou
invisível, para sempre, sem erro na tela**. O céu tinha fallback em CSS desde o
começo, mas de nada adiantava: quem revelava o conteúdo por cima dele era o
aviso de progresso da abertura, que nunca chegava.

Hoje o conteúdo não depende disso, e existe um teste que nega o contexto WebGL e
exige que o herói apareça mesmo assim.

## Falta

- **O estoque.** É o item que falta para o site fazer o que ele foi feito para
  fazer. Ver `/admin`.
- **Fotos próprias da loja.** Existe uma, e ela veio do perfil do Google.
- **Logo em vetor.** O letreiro é um script cromado que só existe dentro de
  foto, então o site usa uma reconstrução tipográfica, não uma cópia.
- **O domínio.** O `deluxmotors.com.br` que eles anunciam no Google não resolve.
- A nota do Google (3,0 com 2 avaliações) ficou de fora de propósito.
