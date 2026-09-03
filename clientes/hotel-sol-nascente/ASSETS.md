# Fotos que faltam · Hotel Sol Nascente

O site está pronto e funcional, mas **nenhuma foto real entrou ainda**. O cliente não enviou
material, as fotos do Instagram só carregam com login e as do Google Maps são de autoria
mista (hóspedes e hotel), sem licença clara para republicação.

Enquanto isso, cada espaço de foto renderiza o céu da hora do dia correspondente com o
rótulo do que vai ali. O site não fica com buraco e o cliente vê a intenção.

## Como trocar

1. Colocar o arquivo em `site/public/images/` com o nome exato da tabela.
2. Em `site/components/hotel-site.tsx`, passar `src` e `alt` para o `<Slot>` daquele lugar:

```tsx
<Slot tag="Foto: fachada do hotel" src="/images/fachada.jpg" alt="Fachada do Hotel Sol Nascente" />
```

O `Slot` já trata `object-fit: cover`, `loading="lazy"` e o gradiente de fundo continua
aparecendo enquanto a imagem carrega. Nada mais precisa mudar.

## A lista

| Arquivo | Onde aparece | Proporção | O que precisa mostrar |
|---|---|---|---|
| `fachada.jpg` | Hero | retrato, ~3:4 | A frente do hotel. De manhã cedo se der, o site inteiro fala de nascer do sol. |
| `nascente.jpg` | Linha do Sol · 05h | paisagem, 4:3 | Fachada ou piscina na primeira luz. |
| `cafe.jpg` | Linha do Sol · 07h | paisagem, 4:3 | Mesa do café da manhã servida. |
| `cidade.jpg` | Linha do Sol · 10h | paisagem, 4:3 | Vista da rua ou do entorno do hotel. |
| `almoco.jpg` | Linha do Sol · 12h | paisagem, 4:3 | Prato do restaurante, sem embalagem de delivery. |
| `piscina.jpg` | Linha do Sol · 15h | paisagem, 4:3 | A piscina externa com sol alto. É o assunto nº 2 nas avaliações. |
| `auditorio-noite.jpg` | Linha do Sol · 19h | paisagem, 4:3 | Auditório montado, com luz acesa. |
| `quarto-noite.jpg` | Linha do Sol · 22h | paisagem, 4:3 | Quarto arrumado, luz de abajur. |
| `quarto-solteiro.jpg` | Quartos | paisagem, 16:10 | Quarto de solteiro inteiro, cama enquadrada. |
| `quarto-casal.jpg` | Quartos | paisagem, 16:10 | Quarto de casal inteiro. |
| `quarto-familia.jpg` | Quartos | paisagem, 16:10 | Quarto família, mostrando as camas extras. |
| `auditorio.jpg` | Seção Auditório | retrato, 4:5 | O salão vazio e montado, para dar noção de tamanho. |
| `restaurante-salao.jpg` | Restaurante | retrato, 3:4 | Salão do restaurante com mesas postas. |
| `prato.jpg` | Restaurante | paisagem, 3:2 | Um prato bem servido. |
| `cafe-manha.jpg` | Restaurante | paisagem, 3:2 | O buffet ou a mesa do café. |
| `arapiraca.jpg` | Seção Arapiraca | retrato, 3:4 | A cidade, o agreste ou a estrada. Não precisa ser do hotel. |

## Também falta (não bloqueia o site)

- **Logo em arquivo.** Hoje a marca do topo é um SVG desenhado aqui, um sol nascendo sobre
  a linha do horizonte. Funciona, mas se existir logo oficial ele entra no lugar.
- **Horário de check-in e check-out.** Não há nada público. Não foi inventado, então não
  aparece no site. Assim que o cliente informar, entra na seção de reserva.
- **E-mail de contato.** Idem. Só existe o WhatsApp (82) 99977-0439, que é o mesmo número
  para reservas e para eventos segundo o Linktree do hotel.
- **Capacidade do auditório.** Quantas pessoas sentadas, quantas em pé. É a primeira coisa
  que quem organiza evento pergunta, e hoje o site não responde.
