import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  clara,
  links,
  agendar,
  areas,
  quandoProcurarCrianca,
  quandoProcurarAdolescente,
  jornada,
  antesDaConversa,
  telefoneLegivel,
} from "@/lib/clara";
import { Cabecalho } from "@/components/cabecalho";
import { Acordeao } from "@/components/acordeao";
import { Jornada } from "@/components/jornada";
import { BotaoFlutuante } from "@/components/botao-flutuante";
import { ScrollSuave } from "@/components/scroll-suave";
import { Entrada } from "@/components/entrada";
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
      {agendar && <BotaoFlutuante href={agendar} />}

      <main id="topo">
        {/* ══════════ Hero ══════════ */}
        <section className="grid min-h-[34rem] grid-cols-1 pt-[var(--altura-cabecalho)] lg:min-h-[42rem] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-0">
          <div className="relative flex items-end justify-center overflow-hidden bg-salvia lg:pt-[var(--altura-cabecalho)]">
            {retrato ? (
              <Image
                src={retrato}
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
                  Brincar é a forma mais séria que uma criança tem de dizer o
                  que sente.
                </h1>
              </Entrada>

              <Entrada delay={0.16}>
                <p className="mt-6 max-w-[42ch] leading-[1.6] text-tinta-media">
                  Psicoterapia para crianças e adolescentes.
                </p>
              </Entrada>

              <Entrada delay={0.24}>
                <div className="mt-9 flex flex-wrap items-center gap-3.5">
                  {agendar && (
                    <a
                      href={agendar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-botao bg-coral px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-transform duration-300 hover:scale-[1.03]"
                    >
                      Agendar conversa
                    </a>
                  )}
                  <a
                    href="#atendimento"
                    className="rounded-botao border border-tinta/25 px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-colors duration-300 hover:border-tinta/60"
                  >
                    Como eu trabalho
                  </a>
                </div>
              </Entrada>
            </div>
          </div>
        </section>

        {/* ══════════ O que trouxe você aqui ══════════ */}
        <section id="comeco" className="py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 md:col-span-4">
                <Etiqueta>Talvez você tenha chegado assim</Etiqueta>

                <div className="relative mt-8 hidden md:block">
                  <div
                    aria-hidden
                    className="folha-alt absolute -left-4 -top-4 h-full w-full bg-oliva/20"
                  />
                  <Image
                    src="/clara-1.jpeg"
                    alt={clara.nome}
                    width={960}
                    height={1280}
                    className="folha-alt relative h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-8">
                <h2 className="font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Alguma coisa mudou e ninguém consegue nomear o quê
                </h2>

                <div className="mt-7 space-y-5 leading-[1.7] text-tinta-media">
                  <p>
                    A professora pediu uma conversa. Ou não foi a escola, foi
                    você percebendo em casa que o clima virou e não sabendo
                    explicar direito desde quando.
                  </p>
                  <p>
                    Ele dorme diferente e explode por motivo pequeno. Ficou
                    calado num assunto que antes rendia a tarde inteira. Você já
                    perguntou de vários jeitos e recebeu “nada” de resposta.
                  </p>
                  <p className="text-tinta">
                    Isso raramente quer dizer que você errou em alguma coisa.
                    Costuma querer dizer que ele ainda não tem palavra para o
                    que está sentindo, e o que não vira palavra acaba virando
                    comportamento.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </Faixa>
        </section>

        {/* ══════════ Sobre mim ══════════ */}
        <section id="sobre" className="bg-salvia py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              {/* Retrato em forma orgânica, elemento gráfico do manual */}
              <div className="col-span-12 md:col-span-5">
                <div className="relative">
                  <div
                    aria-hidden
                    className="folha absolute -left-5 -top-5 h-full w-full bg-coral/25"
                  />
                  <Image
                    src="/clara-3.jpeg"
                    alt={`${clara.nome} no consultório`}
                    width={1280}
                    height={1600}
                    className="folha relative h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-7">
                <Etiqueta>Sobre mim</Etiqueta>

                <h2 className="mt-6 max-w-[22ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Sou {clara.nome} e atendo criança e adolescente
                </h2>

                <div className="mt-6 space-y-5 leading-[1.7] text-tinta-media">
                  <p>
                    No meu consultório tem caixa de brinquedo, jogo de
                    tabuleiro, papel e lápis de cor espalhados. Isso não é
                    decoração de sala de espera. É com isso que a gente
                    trabalha.
                  </p>
                  <p>
                    Criança não senta na poltrona e explica o que está sentindo.
                    Ela mostra. No jogo que escolhe, no personagem que inventa,
                    no desenho que rasga no meio antes de terminar.
                  </p>
                  <p className="text-tinta">
                    Meu trabalho é entender o que está sendo dito ali, e traduzir
                    isso junto com quem cuida dela.
                  </p>
                </div>

                <p className="mt-7 text-mini uppercase tracking-[0.16em] text-coral-texto">
                  {clara.profissao} · {clara.registro}
                </p>
              </div>
            </SectionReveal>
          </Faixa>
        </section>

        {/* ══════════ Atendimento ══════════ */}
        <section id="atendimento" className="py-[var(--space-largo)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 md:col-span-7">
                <Etiqueta>Atendimento</Etiqueta>

                <h2 className="mt-6 max-w-[24ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Com criança, o trabalho começa antes da fala
                </h2>

                <div className="mt-6 space-y-5 leading-[1.7] text-tinta-media">
                  <p>
                    Adulto entra na sala e conta. Criança quase nunca faz isso,
                    e não é por falta de vontade. É que a experiência dela ainda
                    não passou pela palavra.
                  </p>
                  <p>
                    Então o material da sessão é outro. Desenho, brinquedo,
                    jogo, história inventada. É por ali que aparece o que não
                    coube numa frase.
                  </p>
                  <p className="text-tinta">
                    Falar vem depois, quando vem. E quando vem, costuma vir com
                    muito menos esforço do que em casa.
                  </p>
                </div>
              </div>

              {/* A foto com os jogos mostra literalmente o material da sessão */}
              <div className="col-span-12 md:col-span-5">
                <div className="relative">
                  <div
                    aria-hidden
                    className="folha-alt absolute -bottom-5 -right-5 h-full w-full bg-oliva/25"
                  />
                  <Image
                    src="/clara-2.jpeg"
                    alt="Clara Biscarde com jogos usados nas sessões"
                    width={1200}
                    height={1600}
                    className="folha-alt relative h-full w-full object-cover"
                  />
                </div>
              </div>
            </SectionReveal>
          </Faixa>
        </section>

        {/* ══════════ Áreas. Só com dado confirmado. ══════════ */}
        {areas.length > 0 && (
          <section id="areas" className="bg-salvia py-[var(--space-normal)]">
            <Faixa>
              <Etiqueta>Áreas</Etiqueta>
              <RevealLista className="mt-10 grid grid-cols-12 gap-y-8 md:gap-x-10">
                {areas.map((a) => (
                  <RevealItem key={a.titulo} className="col-span-12 md:col-span-6">
                    <p className="font-display text-grande leading-[1.25] text-oliva-texto">
                      {a.titulo}
                    </p>
                    <p className="mt-2 max-w-[44ch] leading-[1.7] text-tinta-media">
                      {a.texto}
                    </p>
                  </RevealItem>
                ))}
              </RevealLista>
            </Faixa>
          </section>
        )}

        {/* ══════════ Isso é fase? · agrupado por faixa etária ══════════ */}
        <section id="pais" className="bg-salvia py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Etiqueta>Para os pais</Etiqueta>
                <h2 className="mt-6 max-w-[20ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                  Isso é fase ou já é hora de procurar?
                </h2>
              </div>
              <p className="max-w-[34ch] text-mini leading-[1.7] text-tinta-media">
                Toque para abrir. Nenhum item fecha diagnóstico sozinho.
              </p>
            </SectionReveal>

            <div className="mt-10 grid grid-cols-12 gap-y-10 md:gap-x-14">
              <SectionReveal className="col-span-12 md:col-span-6">
                <p className="mb-2 border-b border-coral pb-3 text-micro uppercase tracking-[0.18em] text-coral-texto">
                  Criança
                </p>
                <Acordeao itens={quandoProcurarCrianca} />
              </SectionReveal>

              <SectionReveal className="col-span-12 md:col-span-6">
                <p className="mb-2 border-b border-oliva pb-3 text-micro uppercase tracking-[0.18em] text-oliva-texto">
                  Adolescente
                </p>
                <Acordeao itens={quandoProcurarAdolescente} />
              </SectionReveal>
            </div>
          </Faixa>
        </section>

        {/* ══════════ A jornada ══════════ */}
        <section className="py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal>
              <Etiqueta>O caminho até virar rotina</Etiqueta>
              <h2 className="mt-6 max-w-[26ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                De contar pra ele até a terapia virar parte da semana
              </h2>
              <p className="mt-5 max-w-[54ch] text-mini leading-[1.7] text-tinta-media">
                Seis paradas, com dois dragões pelo caminho. Clique em cada uma
                para ver as recomendações.
              </p>
            </SectionReveal>

            <SectionReveal className="mt-14">
              <Jornada paradas={jornada} />
            </SectionReveal>
          </Faixa>
        </section>

        {/* ══════════ Antes da primeira conversa ══════════ */}
        <section className="bg-salvia py-[var(--space-apertado)]">
          <Faixa>
            <SectionReveal>
              <h2 className="max-w-[36ch] font-display text-grande font-normal leading-[1.25] tracking-[-0.01em]">
                Vale separar antes da primeira conversa
              </h2>
            </SectionReveal>

            <RevealLista className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
              {antesDaConversa.map((item, i) => (
                <RevealItem key={item.titulo}>
                  <p className="font-display text-medio leading-[1.15] text-coral-texto">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-mini font-semibold uppercase tracking-[0.1em] text-oliva-texto">
                    {item.titulo}
                  </p>
                  <p className="mt-1.5 text-mini leading-[1.6] text-tinta-media">
                    {item.texto}
                  </p>
                </RevealItem>
              ))}
            </RevealLista>
          </Faixa>
        </section>

        {/* ══════════ Contato. Central de canais. Zero movimento aqui. ══════════ */}
        <section id="contato" className="bg-salvia py-[var(--space-largo)]">
          <Faixa>
            <div className="grid grid-cols-12 gap-y-10 md:gap-x-14">
              <div className="col-span-12 md:col-span-5">
                <Etiqueta>Contato</Etiqueta>

                <h2 className="mt-6 max-w-[18ch] font-display text-titulo font-normal leading-[1.1] tracking-[-0.015em]">
                  Vamos conversar sobre seu filho?
                </h2>

                <p className="mt-5 max-w-[38ch] leading-[1.7] text-tinta-media">
                  Manda mensagem contando o que está acontecendo. Pode ser em
                  duas linhas, do jeito que sair. Quem responde sou eu.
                </p>

                {agendar && (
                  <div className="mt-9 flex flex-wrap gap-3.5">
                    <a
                      href={agendar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-botao bg-coral px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-transform duration-300 hover:scale-[1.03]"
                    >
                      Falar pelo WhatsApp
                    </a>
                    {links.whatsappWeb && (
                      <a
                        href={links.whatsappWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-botao border border-tinta/25 px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-colors duration-300 hover:border-tinta/60"
                      >
                        Abrir no WhatsApp Web
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Central de canais. Cada linha só existe se o dado existir. */}
              <div className="col-span-12 md:col-span-6 md:col-start-7">
                {temContato ? (
                  <dl className="divide-y divide-borda border-y border-borda">
                    {links.whatsapp && (
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
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
                            {telefoneLegivel(clara.whatsapp)}
                          </a>
                        </dd>
                      </div>
                    )}

                    {links.telefone && (
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
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
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
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
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
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
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
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
                      <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                        <dt className="shrink-0 text-micro uppercase tracking-[0.18em] text-coral-texto sm:w-[11ch]">
                          Horários
                        </dt>
                        <dd className="text-tinta">{clara.horario}</dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  /* Sem nenhum canal cadastrado, o bloco não inventa contato. */
                  <div className="rounded-bloco border border-dashed border-coral/60 p-8">
                    <p className="text-micro uppercase tracking-[0.18em] text-coral-texto">
                      Canais de atendimento
                    </p>
                    <p className="mt-3 max-w-[40ch] leading-[1.7] text-tinta-media">
                      WhatsApp, e-mail e Instagram entram aqui assim que forem
                      cadastrados em <code>lib/clara.ts</code>. Enquanto não
                      existirem, nenhum contato é exibido nem inventado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Faixa>
        </section>

        {/* ══════════ Rodapé ══════════ */}
        <footer className="bg-rose py-12">
          <Faixa>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Image
                  src="/logo-assinatura.png"
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
