# Pendentes · Clara Biscarde

Tudo que falta para o site sair do ar de rascunho. Cada item diz onde entra.

---

## 1 · Você resolve agora

### A foto do hero

O arquivo não chegou ao disco, passou só pelo chat. Salva ele exatamente em:

```
clientes/clara-biscarde/site/public/clara.jpg
```

O hero detecta o arquivo sozinho e troca o painel de reserva pela foto. Não precisa mexer em
código.

A foto que ela mandou tem fundo claro quase igual ao creme do site, então vai encaixar sem
recorte. Se puder, manda também uma versão em WebP para o checklist fechar.

---

## 2 · Trava o site até ela responder

### WhatsApp

Sem número, **nenhum botão de agendar existe na página**. Nem o do cabeçalho, nem o do hero,
nem o flutuante, nem o do contato. O site inteiro está sem caminho de conversão.

Assim que chegar, abre `site/lib/clara.ts` e troca:

```ts
whatsapp: null,          →   whatsapp: "5571999999999",
```

Os quatro botões nascem juntos, com a mensagem já preenchida.

### Cidade

CRP 03 é o conselho da Bahia, mas a cidade não foi confirmada e eu não chutei. Ela entra no
rodapé e no JSON LD de busca local, que é o que faz o site aparecer em "psicóloga infantil
em [cidade]".

---

## 3 · Tira o site do genérico

Todas essas respostas já têm lugar reservado em `site/lib/clara.ts`. Preencheu, a seção nasce.

| Pergunta | Onde entra |
|---|---|
| Que idades ela atende | `atendimento.idadeMinima` e `idadeMaxima` |
| Quais queixas chegam mais | `areas` · faz nascer a seção Áreas e o item no menu |
| Qual a abordagem teórica | seção Abordagem, hoje escrita em termos gerais |
| Presencial, online ou os dois | `atendimento.online` e `presencial` |
| Duração e frequência da sessão | `atendimento.duracaoMinutos` e `frequencia` |
| Faz laudo ou parecer para escola | vira seção nova |
| Tem avaliação no Google | libera a prova social que a referência usa |
| Instagram | libera o link do rodapé |

### As três frases dela

Continua sendo o buraco maior. Print de story, áudio transcrito, legenda de post, resposta de
direct. Qualquer coisa escrita ou falada com as palavras dela.

Sem isso a copy está correta e sem dona.

---

## 4 · Precisa da leitura da Clara antes de publicar

Tudo abaixo sai no site com o nome e o CRP dela. São orientações gerais para quem cuida, sem
valor diagnóstico e sem descrever protocolo dela, mas ela responde por elas perante o
conselho.

### A jornada, seis paradas com dicas

`jornada` em `site/lib/clara.ts`. Dezoito recomendações no total, distribuídas em:

1. Antes de abrir o assunto (preparo)
2. A conversa (parada)
3. O "eu não quero ir" (desafio)
4. A primeira sessão (travessia)
5. O silêncio depois (desafio)
6. Quando vira rotina (chegada)

**A parada 5 é a mais sensível.** Ela fala de sigilo com criança e adolescente em termos
gerais e recomenda procurar a psicóloga em vez da criança. Está escrito de forma neutra, mas
sigilo de menor é assunto que só ela deve afirmar com as próprias palavras.

### O acordeão

`quandoProcurar`. Dez situações, incluindo o item marcado como "Procure ajuda agora" sobre
autolesão e ideação, com CVV 188 e SAMU 192. Ver seção 6 abaixo.

### Seções em primeira pessoa

Sobre mim e Abordagem. Mesma regra.

### Removido a pedido

A seção "O que costuma travar na hora de escrever" saiu do site. As três objeções sem
resposta que estavam no código também saíram junto:

* "Eu preciso ficar na sala junto?"
* "Com que idade dá pra começar?"
* "Eu vou ficar sabendo o que ele falou na sessão?"

Se ela quiser responder alguma dessas depois, elas cabem bem como parada nova na jornada.

---

## 5 · Arquivo

O logo veio em PDF. Gerei duas versões em PNG a partir dele:

```
site/public/logo-clara-biscarde.png   logo completo
site/public/logo-assinatura.png       só a assinatura, usada no cabeçalho e no rodapé
```

Separei porque no logo original a profissão e o CRP são miúdos demais e viram borrão em
qualquer tamanho de cabeçalho. No site eles são texto de verdade, ao lado da assinatura.

Vale pedir o SVG original para quem desenhou a marca. PNG em cabeçalho fixo perde nitidez em
tela retina e pesa mais do que precisa.

---

## Cores medidas do logo

Extraídas pixel a pixel do PDF, não estimadas:

```
coral   #E39380
oliva   #968F61
rosa    #B68E85
```

Nenhuma das três passa 4.5:1 como texto sobre o creme do site (dão 2.27, 3.10 e 2.75). Por
isso cada uma tem duas versões nos tokens: a de marca, que só preenche superfície, e a
escurecida, que é a única usada em texto.

Isso está em `site/app/globals.css` e não deve ser desfeito sem medir de novo.
