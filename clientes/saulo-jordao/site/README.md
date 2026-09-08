# Saulo Jordão Premium Cars

Site de corretagem de veículos premium em Aracaju. Next.js 16, App Router,
TypeScript, CSS próprio com tokens. Sem WebGL e sem biblioteca de animação: o
conceito é papel, e papel não precisa de shader.

## Rodar

```bash
npm install
npm run dev          # http://127.0.0.1:3014
npm run build && npm start
```

## Os comandos

| comando | o que faz |
| --- | --- |
| `npm run dev` | desenvolvimento, porta 3014 |
| `npm run build` | build de produção |
| `npm start` | sobe o build, porta 3014 |
| `npm run typecheck` | TypeScript sem emitir |
| `npm run lint` | ESLint |
| `npm run assets` | refaz as imagens a partir de `../assets/carros` e grava o manifesto |
| `npm run qa` | build novo, sobe o servidor e roda 670 verificações num navegador de verdade |
| `npm run qa:rapido` | o mesmo, contra o build que já existe |
| `npm run perf` | mede LCP, CLS e peso, com o `npm start` no ar em outra janela |

## Onde mexer

| o que | onde |
| --- | --- |
| **Carros, preços, fichas** | `lib/estoque.ts`, um objeto por carro |
| **Telefone, e-mail, cidade, Instagram** | `lib/contato.ts` |
| **Campos dos formulários** | `lib/formularios.ts` |
| **Mensagem que vai para o WhatsApp** | `lib/mensagens.ts` e `montarMensagem` em `lib/formularios.ts` |
| **Duração e comportamento da abertura** | `lib/abertura.ts` |
| **Cores, tipografia, espaçamento** | `app/globals.css`, bloco `:root` |
| **Fotos originais** | `../assets/carros`, uma pasta fora do site |

## Imagens

As fotos originais ficam em `clientes/saulo-jordao/assets/carros`, fora do
projeto Next. O `npm run assets` recorta, redimensiona e grava
`public/images/manifest.json` com a dimensão **nativa** de cada origem.

Nenhuma imagem sai maior do que entrou: a largura exportada é
`min(slot * 2, largura nativa)`. O QA compara a caixa desenhada na tela contra a
dimensão nativa do manifesto, e não contra o arquivo exportado, porque um
pipeline que amplia gera arquivo grande e passaria feliz num teste que olhasse
só o export, com a foto borrada na tela.

Para trocar as fotos de um carro: substitua os arquivos `slug-00.jpg`,
`slug-01.jpg` e por aí em `assets/carros`, rode `npm run assets` e atualize o
campo `fotos` do carro em `lib/estoque.ts`.

## Formulários

Não existe servidor por trás deles e nenhum finge que existe. O formulário monta
uma mensagem, a pessoa lê ao lado enquanto digita, e o botão abre o WhatsApp com
o texto pronto.

Para ligar num destino de verdade depois, um CRM ou um e-mail: a função
`montarMensagem` em `lib/formularios.ts` já devolve o texto pronto. O ponto de
troca é o `<a data-enviar>` em `components/formulario.tsx`, que hoje aponta para
`whatsapp(mensagem)`.

## Publicar

```bash
npx vercel link --yes --project saulo-jordao
npx vercel --prod --yes
```

A pasta `qa/` fica fora do deploy pelo `.vercelignore`.

Enquanto o endereço for link de aprovação, o site está fora do índice de busca.
Para publicar de verdade são dois lugares, e só eles: `robots` em
`app/layout.tsx` (`index: true`) e `app/robots.ts` (`allow`). Junto com isso,
defina `NEXT_PUBLIC_SITE_URL` com o domínio final, que é o que alimenta o
canonical, o sitemap e os dados estruturados.

## O portão de QA

`npm run qa` roda contra o build de produção, num Chromium de verdade, e grava as
capturas em `qa/`. Ele cobre rolagem horizontal em oito larguras, a lei da
resolução das imagens contra o manifesto, foto repetida na mesma página,
travessão e palavra duplicada na copy, cada botão conferido um por um contra o
destino que deveria ter, uma varredura atrás de link de WhatsApp fora dos
caminhos autorizados, os campos dos formulários descobertos e cobrados de volta
na mensagem, os filtros conferidos pelo resultado, e a abertura medida por
cobertura ponto a ponto, com o JavaScript derrubado e com o JavaScript
desligado.

Duas regras valem mais que a contagem:

1. Quando um teste passa com o defeito na tela, ele está medindo a coisa errada.
   Conserta o teste primeiro. Perguntar se a cortina existe é inútil: o que
   importa é se ela cobre, ponto a ponto e ao longo do tempo.
2. O instrumento faz parte do experimento. Cada captura congela a animação, então
   quem posa para foto e quem é cronometrada são páginas diferentes, e espera se
   calcula contra um t0, nunca somando intervalos.
