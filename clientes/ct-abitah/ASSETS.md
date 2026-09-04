# Fotos e marca · CT Abitah

## Marca
O cliente enviou `ABITAH_LOGO.pdf` (arquivado em `assets/`). Dele saíram:
- as duas cores oficiais, lidas nos operadores de cor do arquivo: **#5f7a51** e **#44423a**
- `logo.png` e `logo-claro.png`, recortados das páginas e exportados **com canal alfa**
  (colorType 6). Antes dependiam de `mix-blend-mode` e apareciam com caixa ao redor.

Se existir o logo em SVG ou PNG já recortado, ele entra no lugar sem mudar código.

## Fotos
Todas vieram do Google Maps, **filtro "Do proprietário"** de cada unidade: são as que
o próprio hotel publicou. As de visitante ficaram de fora.

| Arquivo | Onde | Observação |
|---|---|---|
| `hero.jpg` | Entrada em tela cheia | Rooftop de Vilas |
| `patamares.jpg` | Credo e unidade Patamares | Parede com o lema da marca |
| `sala.jpg`, `kettlebell.jpg`, `recepcao.jpg`, `feira-sala.jpg`, `vilas-roof-top.jpg`, `buraquinho.jpg` | Modalidades | Ambiente da rede, não da modalidade específica |
| `vitoria.jpg`, `stella-maris.jpg` | Unidades | **Selfie de espelho, qualidade fraca.** Não havia foto de ambiente dessas duas. |
| `buraquinho.jpg`, `feira-de-santana.jpg` | Unidades | Trocadas por ambiente/fachada |
| `vilas-do-atlantico.jpg` | Unidade | Sala com o lema na parede |

### Faltam
- **Pituba** e **Vilas Roof Top**: sem foto. O Google não tem foto do proprietário delas.
- **Vitória** e **Stella Maris**: só existe selfie de turma. Vale pedir foto do espaço.
- Fotos por modalidade. Hoje cada uma usa uma imagem de ambiente da rede, o que é
  honesto mas genérico.

## Mapa
A home usa **Leaflet com tiles do OpenStreetMap**, não a API do Google: o embed do
Google só aceita um lugar por iframe e a API com vários marcadores exige chave. Os
tiles do Carto foram testados e passaram a exigir API key, por isso o OSM.
