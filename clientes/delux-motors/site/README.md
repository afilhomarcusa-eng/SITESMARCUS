# Delux Motors

Site da loja de carros da Boca do Rio, em Salvador. Next.js 16, TypeScript,
Tailwind, um shader de céu em WebGL, Lenis para a rolagem.

## Rodar

```bash
npm install
npm run dev          # desenvolvimento em localhost:3000
npm run build        # build de produção
npm run qa           # build + navegador de verdade + 315 verificações
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

**Preto e branco, claro.** A interface é papel e tinta: branco (`#FFFFFF`),
cinza de concreto para as seções alternadas (`#F2F2F1`) e preto (`#0A0A0A`).

A cor fica onde ela importa, que é dentro das fotos. Os carros são o produto, e
é a lataria deles que tem que puxar o olho. Interface colorida disputa com a
mercadoria.

O site é claro porque a fotografia deles é clara: os carros são fotografados de
dia, no pátio da loja, com céu aberto e piso de concreto. Um site escuro
brigaria com o material que ele existe para mostrar.

A foto do herói é a única quase sem cor (`saturate(0.28)`), de propósito: ali
ela é atmosfera, e a cor fica guardada para o catálogo, onde ajuda a escolher
carro.

### A abertura

O dia chegando. A tela começa numa luz baixa e morna, a claridade sobe pela borda
de baixo, o céu abre, a marca se apresenta no meio da tela e recolhe, e o carro
aparece embaixo do céu que já estava lá. Não existe corte entre abertura e herói:
é a mesma imagem em dois momentos. Roda uma vez por sessão e o primeiro gesto
encerra.

O céu é um shader porque um degradê desse tamanho em CSS mostra faixas: o
navegador interpola em 8 bits sem ruído. Num degradê quase todo branco isso
apareceria ainda mais. No shader o grão entra antes da quantização e o degradê
fica limpo. Se o WebGL não subir, existe um degradê de CSS atrás que imita as
mesmas faixas e fecha no branco da página.

### O relógio da abertura vive em `lib/abertura.ts`

E isso não é organização, é desempenho. Na primeira versão quem contava o tempo
era o componente do céu, e o DOM esperava o aviso dele. O relógio só começava
depois que o pacote do three baixava, então o tempo de carregar a biblioteca
entrava inteiro na conta: **o LCP deu 4,2s**. Encurtar a sequência levou a 2,9s,
ainda reprovando.

Agora o relógio começa na montagem do herói e o céu acompanha por conta própria.
LCP medido: **196 ms**, com o carro na tela em 1,3s na primeira visita da sessão.
O `npm run qa` mede esse tempo a cada execução, para não voltar a crescer em
silêncio.

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

As fotos dos carros são 1288x1610 e a da fachada 1200x1600. As composições
foram desenhadas em cima desses números: o herói é um painel retrato à direita,
com o céu do shader continuando o céu de dentro da foto, e não uma faixa larga
esticada, que entregaria borrão em qualquer monitor grande.

O manifesto em `public/images/manifest.json` guarda a dimensão **nativa** de
cada origem. O QA compara a caixa desenhada contra esse número, nunca contra o
arquivo exportado, porque um pipeline que amplia gera arquivo grande e passaria
feliz num teste que olhasse só o export. Por isso o projeto usa `<img>` e não
`next/image`.

## O estoque

Cinco carros publicados, com ficha e preço saídos das legendas do próprio
Instagram deles. Busca, filtro por marca e faixa de preço, ordenação e contagem.
O estado dos filtros vive na barra de endereço, então uma seleção é um link que
pode ser mandado no WhatsApp.

**Campo em branco não vira opção de filtro, e grupo com uma opção só não é
filtro.** Quatro carros estão sem combustível na legenda de origem e dois sem
tração. Sem essa regra o filtro ganhava uma pílula em branco ao lado de
"Híbrido", e o de câmbio aparecia com "Automático" sozinho, prometendo separar
algo que não separa.

### Alertas

`alertas` é o campo para o que o comprador precisa saber antes de se apaixonar.
A RAM tem passagem por leilão declarada, e isso aparece no cartão da listagem e
em destaque na ficha, nunca escondido no meio da lista de itens.

### Para encher o resto

Cadastre em `/admin`, ou mande a lista para virar carga inicial em
`lib/carros.ts`.

O estado vazio continua existindo e continua vendendo: quando um filtro não
devolve nada, a página oferece o WhatsApp e as outras duas portas do negócio, em
vez de virar beco sem saída.

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

Abertura: o botão do cabeçalho cheio e clicável em seis instantes, o carro
aparecendo em até 2,5s, abertura uma vez por sessão, movimento reduzido, sem
JavaScript, e **sem WebGL**.

Catálogo, conferido pelo resultado e não pelo clique: filtrar BMW tem que deixar
só a BMW, o teto de preço não pode deixar passar nada acima, ordenar por menor
preço tem que produzir lista crescente, abrir o link filtrado tem que já trazer a
lista filtrada, e o alerta de leilão tem que aparecer na listagem e na ficha.
Nenhuma pílula de filtro sem texto e nenhum grupo com uma opção só.

Fluxo do cliente: cadastrar um carro na gerência fazendo ele aparecer no estoque
público, com o preço formatado, e carro sem foto não herdando a lataria de outro.

Quando um defeito for corrigido, a verificação dele entra no mesmo passo. Foi
assim que entraram a do título cortado, a da revelação presa fora da home, a do
tempo até o carro aparecer, a do site sem WebGL, a da pílula em branco e a do
grupo de filtro com uma opção só.

## Dois defeitos que quase passaram

**Estilo inline vence media query.** As duas máscaras da foto do herói, a do
celular e a do desktop, estavam em lugares diferentes: a do celular no `style`
inline do elemento e a do desktop numa regra `@media`. Inline sempre vence, então
o painel do desktop nunca teve esmaecimento lateral, e a emenda entre a foto e o
céu aparecia como uma linha reta atravessando a tela. As duas foram para a folha
de estilo, e é o breakpoint que decide.



O pacote do three falhou ao carregar numa medição e **o herói inteiro ficou
invisível, para sempre, sem erro na tela**. O céu tinha fallback em CSS desde o
começo, mas de nada adiantava: quem revelava o conteúdo por cima dele era o
aviso de progresso da abertura, que nunca chegava.

Hoje o conteúdo não depende disso, e existe um teste que nega o contexto WebGL e
exige que o herói apareça mesmo assim.

## Falta

- **O resto do estoque.** Cinco carros estão publicados. Ver `/admin`.
- **Combustível e tração** dos carros onde a legenda de origem não informa.
- **Fotos próprias da fachada.** Existe uma, e ela veio do perfil do Google.
- **Logo em vetor.** O letreiro é um script cromado que só existe dentro de
  foto, então o site usa uma reconstrução tipográfica, não uma cópia.
- **O domínio.** O `deluxmotors.com.br` que eles anunciam no Google não resolve.
- A nota do Google (3,0 com 2 avaliações) ficou de fora de propósito.
