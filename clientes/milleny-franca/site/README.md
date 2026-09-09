# Site da Psicóloga Milleny França

Next.js 16, TypeScript, Tailwind v4. Sem WebGL e sem GSAP: a profundidade é
2.5D em CSS e SVG.

## Rodar

```bash
npm install
npm run dev            # desenvolvimento
npm run build          # build de produção
npm start              # servir o build
```

## Scripts

| Comando          | O que faz |
|------------------|-----------|
| `npm run imagens`| Gera `public/img` a partir de `../assets/maps` e escreve o manifesto |
| `npm run qa`     | 337 checagens num navegador real, contra o build de produção |
| `npm run perf`   | Mede LCP, CLS e peso transferido |

O `qa` e o `perf` esperam o site servido em `http://127.0.0.1:3210`:

```bash
npx next start -p 3210 -H 127.0.0.1
```

Mude com `QA_BASE=http://localhost:3000 npm run qa`.

**Pare o servidor antes de reconstruir.** Rodar `next build` embaixo de um
`next start` vivo deixa a pasta `.next` inconsistente: o HTML continua
carregando e a folha de estilo passa a devolver 500, então a página aparece sem
CSS e qualquer medição feita depois disso está errada.

## Onde mexer

**Todo dado do negócio está em [`lib/dados.ts`](lib/dados.ts).** Endereço,
telefone, horários, acessibilidade, links e as fotos. Nenhum componente guarda
fato solto, então corrigir um telefone é uma linha só. Os números que aparecem
na página (quantidade de dias abertos, hora de abrir e fechar) são calculados
a partir desse arquivo.

- Textos das seções: `components/*.tsx`
- Âncoras e ordem do menu: `lib/navegacao.ts` (a numeração das seções é derivada, não escrita à mão)
- Cores, tipografia e tempos: `app/globals.css`
- Abertura: `components/cortina.tsx` e `app/cortina.css`
- Imagens originais: `../assets/maps`

### Trocar uma foto

Ponha o arquivo em `../assets/maps`, aponte para ele em `scripts/imagens.mjs`
e rode `npm run imagens`. O script nunca amplia: se o recorte tem 900px, a
maior saída tem 900px. O manifesto guarda a dimensão nativa, e o `npm run qa`
compara o tamanho desenhado na tela contra ela.

### Plugar um destino de verdade no formulário

Hoje não existe servidor. O formulário de `components/contato.tsx` monta a
mensagem e abre o WhatsApp com ela pronta, visível ao lado enquanto a pessoa
digita. Nenhum campo é obrigatório, e campo vazio simplesmente não vira linha.

Para mandar para um CRM ou e-mail, troque o `href` do link `data-cta="formulario"`
por um `onSubmit`. É o único ponto que precisa mudar.

## Antes de publicar

1. Tirar o `robots: { index: false }` de [`app/layout.tsx`](app/layout.tsx).
   Ele está lá porque a URL ainda é só link de aprovação.
2. Trocar `https://millenyfranca.com.br` em `metadataBase` e no JSON-LD pelo
   domínio real.
3. Rodar `npm run qa` e `npm run perf` no build que vai ao ar.

A pasta `qa/capturas` está no `.gitignore` e não deve subir junto com o site.
