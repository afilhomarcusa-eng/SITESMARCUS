# SITES

Pasta de produção de sites para clientes. Um site por cliente, cada um com Next.js próprio.

## Estrutura

```
SITES/
├── _modelos/BRIEFING.md          modelo, nunca preencher aqui
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

## Regras que valem para todo site desta pasta

**Componente vem da biblioteca.** Antes de escrever qualquer componente de UI, procurar em `motion-primitives-website/src/components/`. São 155 componentes em backgrounds, buttons, cards, effects, interactive, layout, navigation, scroll, text, transitions. Copiar o `.tsx` para o projeto do cliente. Não reescrever do zero, não instalar biblioteca concorrente, não editar o original.

**O BRIEFING do cliente é a fonte da verdade.** Ele traz a lista de proibições visuais, a coreografia de scroll, as regras de copy e a tabela de padrão quando um campo está vazio. Ler ele inteiro antes de codar.

**Campo vazio não trava.** Aplicar o padrão da tabela do Bloco 10 do briefing, avisar qual padrão foi assumido, seguir sem esperar resposta.

**Dado de contato nunca é inventado.** Sem telefone no briefing, não existe botão de telefone. Sem `@`, não existe botão de Instagram. Zero placeholder do tipo `(00) 00000-0000` ou "Rua Exemplo, 123". Zero depoimento fictício, zero número redondo sem origem.

**Ordem de construção:** tokens em `globals.css`, página estática inteira, copy definitiva, humanizer, motion por último.

**Copy passa no humanizer** antes de qualquer seção ser considerada pronta.

**Nunca `-g` ou `--global` ao instalar skill.** Sempre no projeto.

## Anti padrão de IA, resumo

O briefing detalha. O essencial que não passa em nenhum site:

Gradiente roxo pra azul. Inter, Poppins ou Montserrat como fonte principal. Grid de 3 cards com ícone em quadradinho. Hero centralizado com botão cheio ao lado de vazado. Mesmo raio de borda em tudo. Espaçamento vertical uniforme entre seções. Emoji como ícone. Travessão no texto. As palavras descubra, transforme, eleve, potencialize, jornada, solução completa, excelência.

Os componentes `aurora`, `gradient-mesh`, `meteors` e `particles` existem na biblioteca e são exatamente esse visual. Só usar se o briefing pedir.

## Skills disponíveis

`ui-ux-pro-max` para decisão de tipografia, paleta e layout. `design-system` para tokens. `brand` para voz. `humanizer` para copy. `agent-browser` para analisar sites de referência.

A `huashu-design` força mostrar 3 direções antes de executar e conflita com o fluxo do briefing. Ignorar em sites de cliente.
