# Fotos · Hotel Sol Nascente

**Todos os espaços de foto do site estão preenchidos.** Nenhum gradiente-placeholder sobrou.

## De onde vieram

Duas fontes, ambas com fotos publicadas pelo próprio hotel:

1. **Google Maps, filtro "Do proprietário"** — 10 fotos que o hotel publicou na ficha dele.
   As de visitante ficaram de fora: pertencem a quem fotografou.
2. **Booking.com** — 72 fotos, todas fornecidas pelo hotel à plataforma. Foi de onde vieram
   as que faltavam: quarto solteiro, quarto família, prato do café e a suíte.

São **provisórias**. O Booking entrega no máximo 1024px e o Maps 1600px, ambos com
compressão. Quando o cliente mandar os originais, substituir o arquivo com o mesmo nome
resolve. Nada no código muda.

## O que está no site

| Arquivo | Onde aparece | Origem |
|---|---|---|
| `fachada.jpg` | Hero | Maps, recorte com a placa "Sol Nascente + Hotel" |
| `fachada-palmeiras.jpg` | Linha do Sol · 05h | Booking |
| `cafe-manha.jpg` | Linha do Sol · 07h e Restaurante | Booking |
| `recepcao.jpg` | Linha do Sol · 10h | Booking |
| `restaurante-salao.jpg` | Linha do Sol · 12h e Restaurante | Booking |
| `piscina.jpg` | Linha do Sol · 15h | Booking |
| `auditorio.jpg` | Linha do Sol · 19h e seção Auditório | Maps (única foto do auditório) |
| `suite.jpg` | Linha do Sol · 22h | Booking |
| `quarto-solteiro.jpg` | Card Quarto Solteiro | Booking |
| `quarto-casal.jpg` | Card Quarto Casal | Booking |
| `quarto-familia.jpg` | Card Quarto Família | Booking |
| `prato.jpg` | Restaurante | Booking |
| `area-externa.jpg` | Seção Arapiraca | Booking |
| `academia.jpg` | Baixada, sem uso. Entra se criarmos uma galeria. | Booking |

## Como trocar

1. Colocar o arquivo em `site/public/images/` com o nome da tabela.
2. Pronto. O `<Slot>` já aponta para esse caminho e cuida de `object-fit: cover` e
   `loading="lazy"`.

## Achados guardados

- **O logo real.** A foto da fachada mostra: banner verde vertical com "Sol Nascente",
  "Hotel" em preto e um símbolo de sol laranja nascendo sobre um morro verde. A marca do
  topo do site é um SVG desenhado aqui no mesmo espírito. Com o arquivo oficial, troco.
- **Existe suíte com hidromassagem.** Aparece no Booking e bate com o destaque "LUA DE MEL"
  do Instagram. Hoje só a suíte comum entra no site. Se o cliente confirmar que é um
  formato vendável, vale um card próprio.

## Ainda falta (não bloqueia o site)

- **Capacidade do auditório.** Quantas pessoas sentadas. É a primeira pergunta de quem
  organiza evento e o site não responde.
- **Check-in e check-out.** Não há horário público. Não foi inventado.
- **E-mail.** Não há e-mail público. Só o WhatsApp (82) 99977-0439, que o Linktree usa
  tanto para reservas quanto para eventos.
