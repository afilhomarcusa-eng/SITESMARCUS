# Fotos · Hotel Sol Nascente

## De onde vieram

As dez fotos em `site/public/images/` foram extraídas do perfil do hotel no Google Maps,
usando **o filtro "Do proprietário"**. São imagens que o próprio hotel publicou na ficha
dele, não fotos de hóspedes. Isso importa: as fotos de visitante pertencem a quem
fotografou e não entram aqui.

Elas são **provisórias**. O Maps entrega no máximo 1600px de largura e com compressão
pesada. Quando o cliente mandar os originais, é só substituir os arquivos mantendo o
mesmo nome, e nada no código precisa mudar.

## O que já está no site

| Arquivo | Onde aparece |
|---|---|
| `fachada.jpg` | Hero. Recorte da entrada, com a placa "Sol Nascente + Hotel" inteira. |
| `fachada-palmeiras.jpg` | Linha do Sol · 05h |
| `cafe-manha.jpg` | Linha do Sol · 07h e no Restaurante |
| `recepcao.jpg` | Linha do Sol · 10h |
| `restaurante-salao.jpg` | Linha do Sol · 12h e no Restaurante |
| `piscina.jpg` | Linha do Sol · 15h |
| `auditorio.jpg` | Linha do Sol · 19h e na seção Auditório |
| `quarto-casal.jpg` | Linha do Sol · 22h e no card Quarto Casal |
| `area-externa.jpg` | Seção Arapiraca |
| `academia.jpg` | Baixada, ainda sem uso. Entra se criarmos uma galeria. |

## O que ainda falta

Estes quatro continuam como gradiente com rótulo, porque o hotel não publicou nenhuma foto
própria deles:

| Arquivo | Onde | Proporção | O que precisa mostrar |
|---|---|---|---|
| `quarto-solteiro.jpg` | Card Quarto Solteiro | paisagem, 16:10 | Quarto de solteiro inteiro, cama enquadrada. |
| `quarto-familia.jpg` | Card Quarto Família | paisagem, 16:10 | Quarto família, mostrando as camas extras. |
| `prato.jpg` | Restaurante | paisagem, 3:2 | Um prato bem servido, sem embalagem de delivery. |
| `arapiraca.jpg` | (opcional) | retrato, 3:4 | A cidade ou o agreste. Hoje esse espaço usa a área externa do hotel. |

## Como trocar ou preencher

1. Colocar o arquivo em `site/public/images/` com o nome da tabela.
2. Em `site/components/hotel-site.tsx`, passar `src` e `alt` para o `<Slot>` daquele lugar:

```tsx
<Slot tag="Quarto solteiro" src="/images/quarto-solteiro.jpg" alt="Quarto de solteiro do hotel" />
```

O `Slot` já cuida de `object-fit: cover` e `loading="lazy"`, e o gradiente continua atrás
enquanto a imagem carrega.

## Também falta (não bloqueia o site)

- **Logo em arquivo.** A foto da fachada revela o logo real: banner verde com "Sol Nascente",
  "Hotel" em preto e um símbolo de sol laranja nascendo sobre um morro verde. A marca do topo
  do site hoje é um SVG desenhado aqui, no mesmo espírito. Com o arquivo oficial, troco.
- **Capacidade do auditório.** Quantas pessoas sentadas. É a primeira pergunta de quem
  organiza evento e o site ainda não responde.
- **Check-in e check-out.** Não há horário público. Não foi inventado.
- **E-mail.** Não há e-mail público. Só o WhatsApp (82) 99977-0439, que o Linktree usa tanto
  para reservas quanto para eventos.
