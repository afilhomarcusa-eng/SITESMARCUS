# Saulo Jordão — Premium Cars

Corretor de veículos premium em Aracaju. Compra, venda, importação e curadoria,
com atendimento em todo o Brasil.

Minerado em 08/09/2026 de `saulojordao.com` (Wix), do perfil `@saulojord` e das
legendas dos 13 anúncios do catálogo.

---

## Concept Lock

```
MODO: A, greenfield. O site atual é Wix e não é editável.
NEGÓCIO: corretor de veículos premium em Aracaju, atende o Brasil inteiro.
PÚBLICO: quem compra carro de R$ 200 mil a R$ 1,3 milhão e chega do Instagram, no celular.
CONVERSÃO: mensagem no WhatsApp já qualificada, com o carro ou com o que a pessoa procura.
SENTIMENTO: claro, preciso, pessoal, caro sem ser barulhento.
CONCEITO: "A prancha". Todo carro dele é fotografado em pé, de celular, no mesmo
  trecho de calçada de Aracaju, com a mesma cerca verde atrás. O site é essa série
  de retratos montada sobre papel, como a prancha de contato de um fotógrafo.
SISTEMA: Instrument Serif no display, Archivo no texto e nos números. Papel morno,
  tinta quase preta, verde-cerca como único acento, cinza-asfalto no apoio. Todas
  as cores medidas nas próprias fotos. Moldura 3:4 é a unidade do layout inteiro.
MOVIMENTO: folha de papel. Revelação por máscara vertical, nunca opacidade mais
  translateY. Peso em vez de mola: cubic-bezier(0.16, 1, 0.3, 1).
PLANOS: fundo é o nome em corpo grande, meio é o retrato, frente é a etiqueta de
  dados que cruza a foto.
MAPA: herói, seis do estoque, quem é Saulo com números computados, as três portas,
  chamada final, rodapé.
MOMENTOS: abertura em diafragma, o retrato que a etiqueta atravessa, a grade que
  filtra sem pular de altura, a ficha com a coluna de fotos em pé.
STACK: Next.js 16, TypeScript, CSS próprio com tokens. Sem WebGL, sem GSAP: o
  conceito é papel, e papel não precisa de shader.
```

## Mapa de conversão

Toda regra do 43B do ASTRA. Nenhum botão começa conversa em branco, exceto o do
cabeçalho, que é a saída de quem só quer falar.

| Onde | Botão | Destino |
| --- | --- | --- |
| Cabeçalho, todas as páginas | WhatsApp | `wa.me` direto. Exceção declarada |
| Herói | Ver o estoque | `/estoque` |
| Herói | Procuro um carro | `/procuro` |
| Cartão de carro | o cartão inteiro | `/estoque/<slug>` |
| Ficha do carro | Falar sobre este carro | `wa.me` com modelo, ano, preço e link |
| Home, três portas | Ver estoque / Procuro / Quero vender | `/estoque`, `/procuro`, `/vender` |
| `/procuro` | Enviar | `wa.me` com a mensagem montada |
| `/vender` | Enviar | `wa.me` com a mensagem montada |
| Rodapé | WhatsApp | `wa.me` direto. Exceção declarada |

## Páginas, cinco no total

1. `/` inicial
2. `/estoque` catálogo com filtros, estado na barra de endereço
3. `/estoque/<slug>` ficha do carro
4. `/procuro` formulário de quem busca um carro
5. `/vender` formulário de quem quer vender o dele

"Quem é Saulo" não virou página. É uma seção da home, porque o texto real cabe em
seis linhas e uma página inteira para isso seria uma página vazia.

## Dado real

- WhatsApp e telefone: (79) 99959-2905. Em internacional, `5579999592905`, 13 dígitos, conferido.
- E-mail: saulojord@live.com
- Instagram: @saulojord, 21,6 mil seguidores em 08/09/2026
- Cidade: Aracaju, Sergipe. Atendimento nacional
- Corretor desde 2019 (texto do "Quem somos" do site atual)
- 13 carros, preço, ano e ficha saídos das legendas do próprio anúncio
- 145 fotos originais, todas verticais, entre 2268x4032 e 4284x5712

## Dado que não existe e por isso não está no site

- Endereço físico. Ele é corretor, não tem loja publicada. Sem endereço, sem mapa
- Horário de atendimento. Não está publicado em lugar nenhum
- Avaliações do Google. O perfil não tem ficha de empresa achável
- Ficha do Audi RS5 2021. O anúncio dele não tem descrição nenhuma. Entra com nome,
  ano, preço e as 10 fotos, e nenhuma linha de ficha inventada

## Decisões pedidas ao cliente em 08/09/2026

- BMW X6 2023: catálogo diz R$ 695.000 e a legenda diz R$ 725.900. Vale R$ 695.000
- Jeep Commander: título diz Overland Hurricane e a legenda diz BlackHawk. Vale BlackHawk
- Audi RS5 sem ficha: publicar assim mesmo

## Proibições que valem aqui

Nada de gradiente, nada de card arredondado em grade de três, nada de emoji como
ícone, nada de caractere decorativo fazendo papel de ícone, nada de travessão na
copy, nada de superlativo vazio. As legendas do cliente têm "menor valor anunciado
no Brasil" e frases assim: fato concreto entra, superlativo não.

## Pendências

- Trocar `robots: index:false` quando o link deixar de ser aprovação e virar o site oficial
- Preço e estoque mudam. Quem edita mexe em `lib/estoque.ts`, um objeto por carro
