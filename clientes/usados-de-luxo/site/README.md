# Usados de Luxo

Site da revenda de seminovos premium de Goiânia. Next.js 16, TypeScript, Tailwind,
Three.js no herói, GSAP não entrou porque não fez falta.

## Rodar

```bash
npm install
npm run dev          # desenvolvimento em localhost:3000
npm run build        # build de produção
npm run qa           # build + navegador de verdade + todas as verificações
```

O `npm run qa` é o portão. Ele derruba o que estiver na porta, faz o build com
nenhum servidor no ar, sobe, confere que quem respondeu é este site, roda 379
verificações e grava as telas em `qa/`. **As telas são para olhar**, não só para
existir: a maior parte dos defeitos que este site já teve era invisível no código
e óbvio numa captura.

Se estiver com pressa e o build já for o atual: `npm run qa:rapido`.

`npm run perf` mede LCP, CLS e o peso transferido contra o build de produção,
com o servidor já no ar. Última medição em rede local: LCP 408 ms, CLS 0,0000,
280 KB de JavaScript (Three.js incluso) e 1,5 MB de imagem no primeiro carregamento.

## O conceito

Todo carro do estoque é fotografado na mesma sala: parede preta, piso claro, luz
montada de lado, placa da casa no lugar da placa real. Não é acaso, é um estúdio,
e é o que permite vender para quem está a dois mil quilômetros e nunca vai ver o
carro pessoalmente.

O site inteiro sai daí. As cores não foram escolhidas, foram medidas das fotos:
o preto é a parede (`#131313`), a pedra é o piso (`#BAB8B8`) e o latão é a cor
dominante do letreiro da fachada (`#D0B060`).

## Onde mexer

| O quê | Arquivo |
|---|---|
| Telefone, WhatsApp, endereço, horário | `lib/contato.ts` |
| Estoque inicial | `lib/carros.ts` |
| Persistência do estoque (**o banco entra aqui**) | `lib/estoque.ts` |
| Perguntas e respostas | `components/secao-duvidas.tsx` |
| Geração das imagens | `scripts/build-assets.mjs` |
| Verificações | `scripts/qa.mjs` |

Nenhum telefone, endereço ou horário aparece escrito solto dentro de componente.
Tudo vem de `lib/contato.ts`, e o QA reconfere a forma de cada número a cada
execução: celular brasileiro em formato internacional tem 13 dígitos, fixo tem 12.

## Imagens

`npm run assets` regenera tudo a partir de `../assets`.

A regra que manda no pipeline: **nenhuma imagem sai maior do que entrou**. A
largura exportada é `min(slot * 2, largura nativa)`. Quando a origem não cobre
2x, sai em 1x e pronto.

O manifesto em `public/images/manifest.json` guarda, para cada arquivo, a
dimensão **nativa da origem**. O QA compara a caixa desenhada na tela contra esse
número, nunca contra o arquivo exportado, porque um pipeline que amplia gera um
arquivo grande e passaria feliz num teste que olhasse só o export.

Por isso o projeto usa `<img>` e não `next/image`: o otimizador tomaria conta da
largura final e a verificação ficaria sem chão para medir. A regra do ESLint está
desligada com essa justificativa escrita em `eslint.config.mjs`.

## A gerência

`/admin`. Cadastra, edita e remove carro, com upload de foto.

Hoje ela grava no **IndexedDB do próprio navegador**. Isso é de propósito e está
escrito na tela: funciona de verdade, o estoque do site muda de verdade, e não
finge ter mandado nada para servidor nenhum. Outro computador não enxerga.

A foto enviada é reduzida para no máximo 1440 px de largura e **nunca ampliada**,
a mesma regra do pipeline.

### Para plugar um banco

Troque as quatro funções de `lib/estoque.ts` (`lerTudo`, `gravarTudo`, `lerFoto`,
`gravarFoto`) por chamadas de API. Nenhum componente, nenhum campo e nenhum
formulário muda por causa disso. Depois disso, ponha uma senha na frente de
`/admin`, que hoje está aberta e só marcada como `noindex`.

O botão **Baixar JSON** exporta o estoque no formato exato de `lib/carros.ts`,
para servir de carga inicial do banco.

## O que o QA verifica

Estrutura em 8 larguras (360 a 1920), um único `h1`, imagens carregadas, console
limpo, nada devolvendo 400 ou mais, nenhuma revelação presa, nenhum título sendo
cortado pela própria caixa, a lei da resolução contra o manifesto, nenhuma imagem
repetida na mesma página, travessão, sobra de inglês, palavra duplicada, clichê
proibido, cada CTA por seletor contra o destino que deveria ter, forma de cada
número de telefone, âncoras que resolvem, `rel="noopener"`, o CTA principal cheio
e clicável em seis instantes da abertura, abertura uma vez por sessão, movimento
reduzido, sem JavaScript, a foto que não pode cobrir a frase do estúdio, largura
usada em 1920, e o cadastro da gerência gravando de verdade.

Quando um defeito for corrigido, a verificação dele entra no mesmo passo. Foi
assim que entraram a do título cortado, a da foto cobrindo o texto e a do carro
sem foto herdando a lataria de outro.

## Falta

- Sábado: o Google só confirma segunda a sexta, das 08:00 às 18:00. O horário de
  sábado não aparece no site nem no schema porque ninguém confirmou.
- O WhatsApp da Kamilla e da Claudia no link da bio tem 12 dígitos
  (`556291587028`) e nenhum celular brasileiro tem 12. Ficaram de fora.
- Logo em vetor. Hoje o logotipo só existe dentro de foto, então o site usa um
  `U` tipográfico, desenhado aqui, e não uma reprodução do logotipo deles.
- Foto da fachada. A que está no site veio do perfil público no Google e está
  creditada na legenda. Vale trocar por uma feita pela casa.
