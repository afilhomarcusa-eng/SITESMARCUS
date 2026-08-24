import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  clara,
  links,
  agendar,
  focos,
  publicos,
  modalidades,
  caminho,
  duvidas,
  telefoneLegivel,
} from "@/lib/clara";
import { Cabecalho } from "@/components/cabecalho";
import { Acordeao } from "@/components/acordeao";
import { Jornada } from "@/components/jornada";
import { BotaoFlutuante } from "@/components/botao-flutuante";
import { ScrollSuave } from "@/components/scroll-suave";
import { Entrada } from "@/components/entrada";
import { FaixaInfo } from "@/components/faixa-info";
import { QuebraSimples } from "@/components/quebra-simples";
import { FormularioContato } from "@/components/formulario-contato";
import {
  Coracao,
  Alvo,
  Raio,
  Estrela,
  Monitor,
  Local,
} from "@/components/desenhos";
import { cn } from "@/lib/utils";
import {
  SectionReveal,
  RevealLista,
  RevealItem,
} from "@/components/section-reveal";

function Faixa({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[80rem] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-botao border border-coral/50 bg-rose-claro px-3 py-1 text-micro uppercase tracking-[0.16em] text-coral-texto">
      {children}
    </span>
  );
}

/** Procura a foto do hero em /public aceitando qualquer extensão comum. */
function acharRetrato(): string | null {
  const pasta = path.join(process.cwd(), "public");
  for (const nome of ["clara.jpg", "clara.jpeg", "clara.png", "clara.webp"]) {
    if (fs.existsSync(path.join(pasta, nome))) return `/${nome}`;
  }
  return null;
}

export default function Home() {
  const retrato = acharRetrato();

  const temContato =
    links.whatsapp ||
    links.telefone ||
    links.email ||
    links.instagram ||
    clara.endereco ||
    clara.horario;

  return (
    <>
      <ScrollSuave />
      <Cabecalho />
      {/* Sem canal cadastrado o botão leva para a seção de contato, que é o
          destino honesto enquanto o número dela não existe. */}
      <BotaoFlutuante href={agendar ?? "#contato"} />

      <main id="topo">
        {/* ══════════ Capa ══════════ */}
        <section className="grid min-h-[34rem] grid-cols-1 pt-[var(--altura-cabecalho)] lg:min-h-[42rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-0">
          <div className="relative flex items-end justify-center overflow-hidden bg-salvia lg:pt-[var(--altura-cabecalho)]">
            {retrato ? (
              <Image
                src={retrato}
                sizes="(min-width: 1024px) 42vw, 100vw"
                alt={`${clara.nome}, ${clara.profissao}`}
                width={clara.retratoLargura}
                height={clara.retratoAltura}
                priority
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full min-h-[22rem] w-full items-center justify-center">
                <div className="folha h-3/4 w-3/5 bg-rose/50" />
              </div>
            )}
          </div>

          {/* Painel em rosé. O manual pede fundo claro e coral como destaque. */}
          <div className="relative flex items-center overflow-hidden bg-rose px-6 py-16 md:px-14 lg:py-24 lg:pt-[calc(var(--altura-cabecalho)+4rem)]">
            {/* Forma orgânica de baixa opacidade, elemento gráfico do manual */}
            <div
              aria-hidden
              className="folha-alt pointer-events-none absolute -right-24 -top-16 h-72 w-72 bg-coral/20"
            />

            <div className="relative w-full max-w-[40rem]">
              <Entrada>
                <p className="text-micro uppercase tracking-[0.2em] text-coral-texto">
                  {clara.nome} · {clara.profissao} · {clara.registro}
                </p>
              </Entrada>

              <Entrada delay={0.08}>
                <h1 className="mt-6 font-display text-hero font-normal leading-[1.08] tracking-[-0.02em] text-tinta">
                  Da brincadeira ao silêncio, existem muitas formas de dizer o
                  que se sente.
                </h1>
              </Entrada>

              <Entrada delay={0.16}>
                <p className="mt-6 max-w-[46ch] leading-[1.7] text-tinta-media">
                  Atendimento psicológico para crianças e adolescentes, além de
                  orientação às famílias, com um olhar acolhedor para as
                  emoções, os comportamentos, as relações e os desafios que
                  fazem parte do crescer.
                </p>
              </Entrada>

              <Entrada delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3.5">
                  <a
                    href={agendar ?? "#contato"}
                    {...(agendar
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="rounded-botao bg-coral px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-transform duration-300 hover:scale-[1.03]"
                  >
                    Agendar pelo WhatsApp
                  </a>
                  <a
                    href="#sobre"
                    className="rounded-botao border border-tinta/25 px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-colors duration-300 hover:border-tinta/60"
                  >
                    Vem conhecer
                  </a>
                </div>
              </Entrada>
            </div>
          </div>
        </section>

        {/* A faixa com os dados dela roda só aqui, na primeira quebra. */}
        <FaixaInfo />

        {/* ══════════ Sobre mim ══════════ */}
        <section id="sobre" className="bg-salvia py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 border-l-4 border-oliva pl-7 md:col-span-7">
                <Etiqueta>Sobre mim</Etiqueta>

                <h2 className="mt-6 max-w-[22ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Entre descobertas, mudanças e formas de crescer
                </h2>

                <div className="mt-6 space-y-5 leading-[1.7] text-tinta-media">
                  <p>
                    A Psicologia transformou a minha forma de enxergar a
                    infância e a adolescência. Ela me ensinou a olhar para além
                    do que aparece: para os sentimentos por trás dos
                    comportamentos, para o que uma brincadeira comunica e para
                    aquilo que ainda não encontrou palavras.
                  </p>
                  <p>
                    Ao longo da minha trajetória, especialmente nas experiências
                    com crianças e adolescentes no ambiente escolar, esse olhar
                    ganhou ainda mais sentido. Passei a me interessar pelas
                    diferentes formas de expressão, pelos vínculos e pelos
                    desafios de cada etapa do crescer.
                  </p>
                  <p>
                    No consultório, busco oferecer um espaço de acolhimento e
                    segurança, respeitando a singularidade de cada criança e
                    adolescente e ajudando-os a compreender suas emoções,
                    relações e experiências. A orientação às famílias também faz
                    parte desse processo, construindo caminhos possíveis para os
                    desafios do cotidiano.
                  </p>
                  <p>
                    Sou psicóloga formada pela Escola Bahiana de Medicina e
                    Saúde Pública e pós-graduanda em Terapia
                    Cognitivo-Comportamental pelo INTCC. Atuo com crianças,
                    adolescentes e orientação de famílias.
                  </p>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5">
                {/* Foto parada. A flutuação daqui foi retirada a pedido dela. */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/clara-3.jpeg"
                    alt={`${clara.nome} no consultório`}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </SectionReveal>
          </Faixa>
        </section>

        <QuebraSimples />

        {/*
          ══════════ Cada fase ══════════
          A cliente avisou que vai mandar uma referência de layout para esta
          seção. Grade de quatro sem hierarquia até ela chegar.
        */}
        <section id="fases" className="py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 md:col-span-4">
                {/* Foto parada. A flutuação daqui foi retirada a pedido dela. */}
                <Image
                  src="/clara-1.jpeg"
                  sizes="(min-width: 768px) 30vw, 100vw"
                  alt={clara.nome}
                  width={960}
                  height={1280}
                  className="folha-alt hidden h-full w-full object-cover md:block"
                />
              </div>

              <div className="col-span-12 md:col-span-8">
                <h2 className="max-w-[24ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Cada fase traz descobertas, mudanças e desafios
                </h2>
                <p className="mt-7 max-w-[60ch] leading-[1.7] text-tinta-media">
                  Nem sempre é fácil entender o que está acontecendo com uma
                  criança ou adolescente. Mudanças nas emoções, nos
                  comportamentos ou nas relações podem gerar dúvidas e
                  preocupações na família. O acompanhamento psicológico oferece
                  um espaço de escuta e compreensão, respeitando a história, a
                  fase do desenvolvimento e as necessidades de cada um.
                </p>
              </div>
            </SectionReveal>

            {/*
              Quatro cartões com ícone, cores exatas da paleta (oliva e
              coral) alternadas, como na referência que ela mandou. Texto é
              o dela, sem alteração.

              O oliva sólido (#958f62) não fecha 4.5:1 com nenhum texto do
              site — é tom médio demais, meio do caminho entre preto e
              branco. bg-oliva/92 é o mesmo hex a 92% de opacidade: passa em
              4.6:1 e a olho nu não se distingue do sólido. O coral
              (#e39380) já passa liso, sem precisar disso.

              O corpo do texto usa text-tinta em vez do text-tinta-media
              padrão do site: tinta-media é claro demais para essas duas
              cores de fundo (passa em sálvia e rosé, mas não aqui).
            */}
            <RevealLista className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {focos.map((foco, i) => {
                const Icone = [Coracao, Alvo, Raio, Estrela][i];
                return (
                  <RevealItem
                    key={foco.titulo}
                    className={cn(
                      "rounded-bloco p-7 md:p-8",
                      i % 2 === 0 ? "bg-oliva/92" : "bg-coral"
                    )}
                  >
                    <Icone className="h-7 w-7 text-oliva-texto" />
                    <p className="mt-5 font-display text-grande leading-[1.25] text-tinta">
                      {foco.titulo}
                    </p>
                    <p className="mt-2 max-w-[38ch] leading-[1.7] text-tinta">
                      {foco.texto}
                    </p>
                  </RevealItem>
                );
              })}
            </RevealLista>
          </Faixa>
        </section>

        <QuebraSimples />

        {/*
          ══════════ Atendimento ══════════
          A faixa de modalidades no fim da seção também espera modelo dela.
        */}
        {/*
          Uma faixa só, fundo único, foto no meio sem moldura: layout da
          referência que ele mandou. A foto entra com mix-blend-multiply, que
          faz o fundo branco do estúdio virar a própria cor da seção — é o que
          dá o efeito de recorte sem eu ter o arquivo com fundo removido.
        */}
        <section id="atendimento" className="bg-rose-claro py-[var(--space-largo)]">
          <Faixa>
            <div className="grid items-center gap-y-14 md:grid-cols-[1fr_1.05fr_1fr] md:gap-x-10">
              <SectionReveal>
                <Etiqueta>Atendimento</Etiqueta>

                <h2 className="mt-7 max-w-[16ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Um espaço que conversa com{" "}
                  <span className="italic text-oliva-texto">cada fase</span>
                </h2>

                <span
                  aria-hidden
                  className="mt-8 block h-[2px] w-12 bg-oliva-texto/70"
                />

                <p className="mt-7 max-w-[34ch] leading-[1.75] text-tinta-media">
                  Acolhimento, escuta e cuidado para você e sua família
                  atravessarem cada momento com mais leveza.
                </p>

                <a
                  href={agendar ?? "#contato"}
                  {...(agendar
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-9 inline-block rounded-botao bg-oliva-texto px-8 py-4 text-mini font-semibold uppercase tracking-[0.12em] text-creme transition-transform duration-300 hover:scale-[1.03]"
                >
                  Agendar consulta
                </a>
              </SectionReveal>

              <div className="relative mx-auto aspect-[3/4] w-full max-w-[26rem]">
                <Image
                  src="/clara-2.jpeg"
                  alt="Clara Biscarde"
                  fill
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover object-top mix-blend-multiply"
                />
              </div>

              <SectionReveal>
                {modalidades.map((modalidade, i) => {
                  const Selo = i === 0 ? Monitor : Local;
                  return (
                    <div
                      key={modalidade.titulo}
                      className={
                        i === 0 ? "" : "mt-8 border-t border-oliva/25 pt-8"
                      }
                    >
                      <div className="flex items-center gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral/25 text-coral-texto">
                          <Selo className="h-5 w-5" />
                        </span>
                        <p className="text-mini font-semibold uppercase tracking-[0.14em] text-oliva-texto">
                          {modalidade.titulo}
                        </p>
                      </div>
                      <p className="mt-3 max-w-[34ch] leading-[1.75] text-tinta-media">
                        {modalidade.texto}
                      </p>
                    </div>
                  );
                })}
              </SectionReveal>
            </div>

            <RevealLista className="mt-[var(--space-normal)] grid grid-cols-12 gap-y-9 md:gap-x-12">
              {publicos.map((publico) => (
                <RevealItem
                  key={publico.titulo}
                  className="col-span-12 border-t-2 border-oliva pt-5 md:col-span-4"
                >
                  <p className="font-display text-grande leading-[1.25] text-oliva-texto">
                    {publico.titulo}
                  </p>
                  <p className="mt-2.5 leading-[1.7] text-tinta-media">
                    {publico.texto}
                  </p>
                </RevealItem>
              ))}
            </RevealLista>
          </Faixa>
        </section>

        <QuebraSimples />

        {/* ══════════ Por onde começamos ══════════ */}
        <section id="caminho" className="bg-salvia py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal>
              <Etiqueta>Por onde começamos?</Etiqueta>
              <h2 className="mt-6 max-w-[26ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                Do primeiro contato ao acompanhamento
              </h2>
              <p className="mt-5 max-w-[60ch] leading-[1.7] text-tinta-media">
                O acompanhamento é construído passo a passo, desde o primeiro
                contato com a família até os encontros com a criança ou
                adolescente, sempre respeitando a história, o tempo e as
                necessidades de cada um.
              </p>
            </SectionReveal>

            <SectionReveal className="mt-14">
              <Jornada paradas={caminho} />
            </SectionReveal>
          </Faixa>
        </section>

        <QuebraSimples />

        {/* ══════════ Dúvidas ══════════ */}
        <section id="duvidas" className="bg-rose py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal>
              <Etiqueta>Dúvidas</Etiqueta>
              <h2 className="mt-6 max-w-[24ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                Antes de começar…
              </h2>
            </SectionReveal>

            <SectionReveal className="mx-auto mt-10 max-w-[52rem]">
              <Acordeao itens={duvidas} />
            </SectionReveal>
          </Faixa>
        </section>

        <QuebraSimples />

        {/* ══════════ Vamos conversar? ══════════ */}
        <section id="contato" className="bg-salvia py-[var(--space-largo)]">
          <Faixa>
            <SectionReveal className="mx-auto max-w-[38rem] text-center">
              <Etiqueta>Contato</Etiqueta>
              <h2 className="mt-6 font-display text-titulo font-normal leading-[1.1] tracking-[-0.015em]">
                Vamos conversar?
              </h2>
              <p className="mt-5 leading-[1.7] text-tinta-media">
                Se deseja saber mais sobre o atendimento psicológico para
                crianças, adolescentes ou orientação de famílias, entre em
                contato.
              </p>
            </SectionReveal>

            <div className="mx-auto mt-12 max-w-[42rem] rounded-bloco border border-borda bg-creme p-7 sm:p-9">
              <h3 className="font-display text-grande font-normal leading-[1.25]">
                Envie uma mensagem
              </h3>
              <p className="mt-2 max-w-[46ch] text-mini leading-[1.7] text-tinta-media">
                O que você escrever aqui chega no meu WhatsApp já montado. Dá
                para reler e mudar antes de mandar.
              </p>

              <FormularioContato />

              {agendar && (
                <p className="mt-7 border-t border-borda pt-6 text-mini leading-[1.7] text-tinta-media">
                  Prefere ir direto?{" "}
                  <a
                    href={agendar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tinta underline decoration-coral decoration-2 underline-offset-4"
                  >
                    Abrir a conversa no WhatsApp
                  </a>
                  {links.whatsappWeb && (
                    <>
                      {" ou "}
                      <a
                        href={links.whatsappWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tinta underline decoration-coral decoration-2 underline-offset-4"
                      >
                        no WhatsApp Web
                      </a>
                    </>
                  )}
                  .
                </p>
              )}
            </div>

            {/* Central de canais, secundária. Cada linha só existe se o dado existir.
                Sem nenhum canal cadastrado a lista inteira some, sem aviso no lugar. */}
            {temContato && (
              <div className="mx-auto mt-14 max-w-[34rem]">
                <dl className="divide-y divide-borda border-y border-borda">
                  {links.whatsapp && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        WhatsApp
                      </dt>
                      <dd>
                        <a
                          href={links.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tinta underline decoration-coral decoration-2 underline-offset-4"
                        >
                          {/* Sem o número dela, o link não vira texto vazio:
                              vira o convite para abrir a conversa. */}
                          {telefoneLegivel(clara.whatsapp) ??
                            "Abrir a conversa"}
                        </a>
                      </dd>
                    </div>
                  )}

                  {links.telefone && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        Telefone
                      </dt>
                      <dd>
                        <a href={links.telefone} className="text-tinta">
                          {telefoneLegivel(clara.telefone)}
                        </a>
                      </dd>
                    </div>
                  )}

                  {links.email && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        E-mail
                      </dt>
                      <dd>
                        <a href={links.email} className="text-tinta">
                          {clara.email}
                        </a>
                      </dd>
                    </div>
                  )}

                  {links.instagram && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        Instagram
                      </dt>
                      <dd>
                        <a
                          href={links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tinta"
                        >
                          @{clara.instagram}
                        </a>
                      </dd>
                    </div>
                  )}

                  {clara.endereco && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        Endereço
                      </dt>
                      <dd className="whitespace-pre-line text-tinta">
                        {clara.endereco}
                        {clara.cidade ? `\n${clara.cidade}` : ""}
                        {clara.estado ? `, ${clara.estado}` : ""}
                      </dd>
                    </div>
                  )}

                  {clara.horario && (
                    <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-center sm:gap-8">
                      <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                        Horários
                      </dt>
                      <dd className="text-tinta">{clara.horario}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </Faixa>
        </section>

        {/* ══════════ Rodapé ══════════ */}
        <footer className="bg-rose py-12">
          <Faixa>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Image
                  src="/logo-assinatura.png"
                  sizes="260px"
                  alt={clara.nome}
                  width={3124}
                  height={841}
                  className="h-14 w-auto"
                />
                <p className="mt-4 text-mini uppercase tracking-[0.16em] text-tinta-media">
                  {clara.profissao} · {clara.registro}
                </p>
                {clara.cidade && (
                  <p className="mt-1 text-mini text-tinta-media">
                    {clara.cidade}
                    {clara.estado ? `, ${clara.estado}` : ""}
                  </p>
                )}
              </div>

              {links.instagram && (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mini uppercase tracking-[0.16em] text-tinta-media underline decoration-1 underline-offset-4 transition-colors hover:text-tinta"
                >
                  @{clara.instagram}
                </a>
              )}
            </div>
          </Faixa>
        </footer>
      </main>
    </>
  );
}
