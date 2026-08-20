# Briefing de Site

Preenche o que souber, marca `[x]` no que escolher, cola o arquivo inteiro no agente.

**Campo vazio não trava nada.** O agente segue com o padrão da tabela do Bloco 10.

---

## 1 · Cliente

```
Negócio         → Consultório de Psicanálise
Quem atende     → Roberta Dantas
Cidade          → Aracaju, Sergipe
WhatsApp        →
Telefone fixo   →
E mail          →
Instagram (@)   → robertadantaspsi
Endereço        →
Horário         →
Logo (caminho)  →
Fotos (pasta)   → assets/
Domínio         → robertadantas.psi.br (sugestão)
```

Única regra sem exceção: **dado de contato vazio remove o elemento**. Sem Instagram preenchido, o botão de Instagram não existe. Nada de "Rua Exemplo, 123" nem `(00) 00000-0000`.

---

## 2 · Nicho

```
Nicho                      → Psicanálise, saúde mental
O que vende                → Atendimento psicoterápico (presencial e online)
Ticket médio               → R$ 180 a R$ 250 por sessão (estimar)
Quem compra                → Adultos buscando terapia, com poder aquisitivo, reflexivos
Concorrente                → Outras psicólogas em Aracaju
O que ele faz melhor que o concorrente → Especialização em psicanálise + formação em psicologia hospitalar e saúde + em formação contínua
```

A última linha manda na copy inteira. "Atendimento humanizado" não serve. "Laudo em 24h, concorrente entrega em 5 dias" serve.

---

## 3 · Intenção

Marca **uma**:

```
[ ] Fechar no WhatsApp
[x] Agendamento
[ ] Capturar e mail
[ ] Vender no site
[ ] Vitrine e autoridade
```

Padrão se nada marcado: fechar no WhatsApp.

---

## 4 · Referências

```
Referência 1  → https://www.psicologarafaela.com.br (exemplo de site de psicóloga com autoridade)
Referência 2  → (deixar vazio para agente escolher)
Site que odeia → (deixar vazio)
```

O agente abre cada uma com agent browser e extrai escala tipográfica em px, paleta em hex, densidade de espaçamento e onde a animação aparece.

```bash
npx agent-browser open URL --screenshot
```

Referência calibra proporção, não copia layout.

---

## 5 · Visual

### Não entra

**Cor:** gradiente roxo pra azul, gradiente em headline, blobs desfocados no fundo, card de vidro sobre gradiente, mais de dois tons de destaque.

**Tipo:** Inter, Poppins ou Montserrat como principal. Fonte única pra tudo. Headline centralizada em toda seção.

**Layout:** grid de 3 cards com ícone em quadradinho arredondado. Hero centralizado com botão cheio ao lado de botão vazado. Mesmo raio de borda em tudo. Mesmo espaçamento entre todas as seções. Emoji como ícone.

**Conteúdo:** depoimento inventado, foto de banco de imagem, número redondo sem origem.

### Entra

```
Fonte de display  → Serifa elegante (Playfair Display, Lora ou Cormorant)
Fonte de texto    → Grotesca neutra e legível (Sora, Outfit ou similar)
Fundo             → Off-white ou bege quente
Texto             → Cinza escuro ou marrom (não preto puro)
Destaque          → Tom terracota ou verde sage (acolhedor, não chamativo)
```

Três quebras obrigatórias:

1. **Assimetria.** Pelo menos uma seção fora do grid.
2. **Hierarquia de 4x** entre o maior e o menor texto. Site de IA fica todo no meio termo.
3. **Ritmo irregular.** Seção densa, seção arejada, seção densa. Espaçamento uniforme é a assinatura mais óbvia de geração automática.

---

## 6 · Motion no scroll

Componentes reais de `motion-primitives-website/src/components/`.

| Scroll | Seção | Movimento | Componente |
|---|---|---|---|
| 0 a 10% | Hero | Entrada suave, sem parallax ainda | `hero-sections`, `text-reveal` |
| 10 a 25% | Bio | Revelação suave | `section-reveal` |
| 25 a 45% | Abordagem | Parallax leve só de fundo | `parallax-scroll` |
| 45 a 65% | Especializações | Revela bloco por bloco conforme entra | `section-reveal` |
| 65 a 80% | Agendamento | Estático, foco no botão | nenhum |
| 80 a 100% | Rodapé | **Estático** | nenhum |

A última linha é de propósito. Movimento perto do botão final rouba o clique.

### Regras

* Máximo **dois** tipos de animação simultâneos
* Duração entre **400ms e 800ms**
* Easing `cubic-bezier(0.16, 1, 0.3, 1)`. Nunca `linear`
* Dispara **uma vez**. Reanimar no scroll de volta é cara de template
* Threshold **20%**, não zero
* Stagger de **60ms a 100ms** entre irmãos
* `prefers-reduced-motion` desliga tudo
* Zero animação em texto corrido

### Cuidado

`aurora`, `gradient-mesh`, `meteors` e `particles` existem no repo e são exatamente o visual de IA. Só usa se o Bloco 4 pedir.

Preferir `grid`, `spotlight` ou fundo liso com grão.

```
[ ] Cursor customizado
[ ] Preloader
[ ] Transição de página
[x] Scroll suave (Lenis)
```

---

## 7 · Copy

### Voz

```
3 frases reais da cliente:
1. "Eu entendo as suas razões, mas eu não posso esquecer das minhas"
2. "Só lembre-se…"
3. "Vamos trilhar esse caminho juntos?!"

Palavra que ela usa e o setor não usa → trilhar (em vez de "jornada" ou "processo")
Tratamento: [x] você  [ ] senhor  [ ] a gente
```

Sem as 3 frases a copy sai categoria, não pessoa.

### Não entra

**Palavras:** descubra, transforme, eleve, potencialize, impulsione, revolucione, desbloqueie, jornada, solução completa, experiência única, excelência, inovador, robusto, essencial, imperdível.

**Construções:** travessão no meio da frase, "não apenas X, mas Y", "mais do que X, é Y", três itens quando dois bastavam, pergunta retórica abrindo seção, "em um mundo cada vez mais", frases de tamanho idêntico empilhadas, todo parágrafo com três sentenças.

**Estrutura:** headline que descreve o serviço em vez de nomear o resultado. Subtítulo que repete a headline. Benefício sem número quando existe número.

### Entra

* Frase curta ao lado de frase longa. Ritmo irregular é assinatura humana
* Número específico vence adjetivo
* Problema antes de solução
* Uma frase por seção informal a ponto de parecer erro. É ela que prova que tem gente atrás
* Objeção respondida onde ela nasce, não numa FAQ no rodapé

### Verificação

A skill `humanizer` está ativa. O agente passa ela em toda a copy. Texto que voltou e ainda tem palavra da lista volta de novo.

---

## 8 · Botões

```
[ ] WhatsApp flutuante
    Mensagem →
[x] Instagram
[ ] Formulário
    Campos →
[ ] Google Maps
```

```
WhatsApp   https://wa.me/55DDDNUMERO?text=Oi%2C+vim+pelo+site
Telefone   tel:+55DDDNUMERO
E mail     mailto:endereco@dominio
Instagram  https://instagram.com/robertadantaspsi
```

Botão flutuante usa `magnetic-button`. O círculo verde com o logo do WhatsApp dentro é reconhecido como template em meio segundo.

---

## 9 · Seções

```
[x] Hero
[ ] Prova rápida
[x] O problema
[x] O que entrega
[x] Como funciona
[x] Diferencial
[ ] Trabalhos anteriores
[ ] Depoimento (só se for real)
[ ] Preço ou faixa
[x] Objeções
[x] Contato
[x] Rodapé
```

Seis seções fortes convertem mais que doze fracas.

---

## 10 · Execução

### Padrão quando vazio

| Campo | Padrão |
|---|---|
| Intenção | Agendamento (já marcado) |
| Seções | Hero, bio, abordagem, especializações, agendamento, contato, rodapé |
| Fontes | Serifa para display, grotesca neutra para corpo |
| Paleta | Off-white, cinza escuro, destaque em terracota |
| Cursor, preloader, transição | Desligados |
| Scroll suave | Ligado |
| Botões | Instagram no rodapé (está marcado) |
| Tom | Você |
| Referência | Agente escolhe site de psicóloga com autoridade visual |
| **Dado de contato** | **Remove o elemento. Nunca inventa** |

### Ordem

1. Lista o que ficou vazio e qual padrão assumiu. Segue sem esperar resposta
2. Abre as referências do Bloco 4, se tiver
3. Escreve `globals.css` com os tokens. Nenhum valor hardcoded depois disso
4. Página inteira estática, sem uma animação
5. Copy definitiva. Passa no humanizer
6. Motion por último, uma seção por vez
7. Componente sai de `motion-primitives-website/src/components/`. Copia o `.tsx`, não reescreve
8. Zero dado que não veio do Bloco 1

---

## Checklist de aceite

O agente responde item por item antes de dizer que terminou.

**Visual**
```
[ ] Zero gradiente roxo pra azul
[ ] Duas fontes distintas
[ ] Uma seção fora do grid
[ ] Raio de borda varia por tipo de elemento
[ ] Espaçamento vertical irregular
[ ] Nenhum emoji como ícone
[ ] Diferença de 4x entre maior e menor texto
```

**Motion**
```
[ ] Nunca mais de dois tipos de animação juntos
[ ] Durações entre 400ms e 800ms
[ ] Nada reanima no scroll de volta
[ ] prefers-reduced-motion desliga tudo
[ ] Zero movimento no fechamento
```

**Copy**
```
[ ] Zero palavras da lista
[ ] Zero travessões
[ ] Comprimento de frase varia
[ ] Cada benefício tem número ou foi cortado
[ ] Headline nomeia resultado
[ ] Humanizer rodou
```

**Dados**
```
[ ] Telefone é link tel:
[ ] WhatsApp abre com mensagem pronta
[ ] Zero dado inventado
[ ] JSON LD de LocalBusiness com dados reais
```

**Técnico**
```
[ ] Funciona a 375px
[ ] Sem rolagem horizontal
[ ] Contraste mínimo 4.5:1
[ ] Imagens em WebP com width e height
[ ] Title e meta description escritos à mão
```

Caixa não marcada, o agente conserta antes de entregar.
