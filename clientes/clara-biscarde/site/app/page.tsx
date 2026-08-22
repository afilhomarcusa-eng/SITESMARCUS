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
import { FotoFlutuante } from "@/components/foto-flutuante";
import { FormularioContato } from "@/components/formulario-contato";
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
        {/* ══════════ Hero ══════════ */}
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

        {/* A faixa com os dados dela roda só aqui, na primeira quebra. Repetir
            os mesmos três itens a cada seção cansava e gastava o efeito. */}
        <FaixaInfo />

        {/*
          ══════════ Sobre mim ══════════
          Subiu para logo depois da capa: quem chega quer saber com quem vai
          falar antes de ouvir sobre o método.
        */}
        <section id="sobre" className="bg-salvia py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 border-l-4 border-oliva pl-7 md:col-span-7">
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
                    Meu trabalho é entender o que está sendo dito ali, e
                    traduzir isso junto com quem cuida dela.
                  </p>
                </div>

                <p className="mt-7 text-mini uppercase tracking-[0.16em] text-coral-texto">
                  {clara.profissao} · {clara.registro}
                </p>
              </div>

              {/* Sem massa de cor atrás: a foto sozinha, respirando. */}
              <div className="col-span-12 md:col-span-5">
                <FotoFlutuante duracao={7.5}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src="/clara-3.jpeg"
                      alt={`${clara.nome} no consultório`}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </FotoFlutuante>
              </div>
            </SectionReveal>
          </Faixa>
        </section>

        <QuebraSimples />

        {/* ══════════ O que trouxe você aqui ══════════ */}
        <section id="comeco" className="py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              <div className="col-span-12 md:col-span-4">
                <Etiqueta>Talvez você tenha chegado assim</Etiqueta>

                <FotoFlutuante
                  className="mt-8 hidden md:block"
                  duracao={8.5}
                  atraso={0.8}
                >
                  <Image
                    src="/clara-1.jpeg"
                    sizes="(min-width: 768px) 30vw, 100vw"
                    alt={clara.nome}
                    width={960}
                    height={1280}
                    className="folha-alt h-full w-full object-cover"
                  />
                </FotoFlutuante>
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

        <QuebraSimples />

        {/* ══════════ Atendimento ══════════ */}
        <section id="atendimento" className="bg-rose py-[var(--space-largo)]">
          <Faixa>
            <SectionReveal className="grid grid-cols-12 items-center gap-y-10 md:gap-x-14">
              {/* A foto com os jogos mostra literalmente o material da sessão */}
              <div className="col-span-12 md:col-span-5">
                <FotoFlutuante duracao={8} atraso={0.4}>
                  <Image
                    src="/clara-2.jpeg"
                    sizes="(min-width: 768px) 40vw, 100vw"
                    alt="Clara Biscarde com jogos usados nas sessões"
                    width={1200}
                    height={1600}
                    className="folha-alt h-full w-full object-cover"
                  />
                </FotoFlutuante>
              </div>

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
            </SectionReveal>
          </Faixa>
        </section>

        {/* ══════════ Áreas. Só com dado confirmado. ══════════ */}
        {areas.length > 0 && (
          <section id="areas" className="py-[var(--space-normal)]">
            <Faixa>
              <Etiqueta>Áreas</Etiqueta>
              <RevealLista className="mt-10 grid grid-cols-12 gap-y-8 md:gap-x-10">
                {areas.map((a) => (
                  <RevealItem
                    key={a.titulo}
                    className="col-span-12 md:col-span-6"
                  >
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

        <QuebraSimples />

        {/*
          ══════════ O caminho até virar rotina ══════════
          Passou para antes de "Isso é fase?": primeiro a pessoa vê como o
          caminho funciona, e só depois encara a lista de sinais.

          Trocou de sálvia com a seção seguinte junto com a posição, senão
          ficaria rosé colada em rosé com Atendimento logo acima.
        */}
        <section className="bg-salvia py-[var(--space-normal)]">
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

        <QuebraSimples />

        {/* ══════════ Isso é fase? · agrupado por faixa etária ══════════ */}
        <section id="pais" className="bg-rose py-[var(--space-normal)]">
          <Faixa>
            <SectionReveal>
              <Etiqueta>Para os pais</Etiqueta>
              <h2 className="mt-6 max-w-[20ch] font-display text-titulo font-normal leading-[1.12] tracking-[-0.015em]">
                Isso é fase ou já é hora de procurar?
              </h2>
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

        <QuebraSimples />

        {/* ══════════ Vamos conversar? · fotos e contato juntos, fechando no WhatsApp ══════════ */}
        <section id="contato" className="bg-salvia py-[var(--space-largo)]">
          <Faixa>
            <SectionReveal className="mx-auto max-w-[38rem] text-center">
              <Etiqueta>Contato</Etiqueta>
              <h2 className="mt-6 font-display text-titulo font-normal leading-[1.1] tracking-[-0.015em]">
                Vamos conversar sobre seu filho?
              </h2>
              <p className="mt-5 leading-[1.7] text-tinta-media">
                Manda mensagem contando o que está acontecendo. Pode ser em duas
                linhas, do jeito que sair. Quem responde sou eu.
              </p>
            </SectionReveal>

            {/*
              O formulário substituiu os dois botões grandes que ficavam aqui:
              com "Enviar via WhatsApp" logo abaixo dos campos, mais um par de
              botões com o mesmo destino só dividia a atenção. Quem prefere ir
              direto tem o link discreto no rodapé do bloco.
            */}
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

            {/* Central de canais, secundária. Cada linha só existe se o dado existir. */}
            <div className="mx-auto mt-14 max-w-[34rem]">
              {temContato ? (
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
                          {telefoneLegivel(clara.whatsapp)}
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
              ) : (
                /* Sem nenhum canal cadastrado, o bloco não inventa contato. */
                <div className="rounded-bloco border border-dashed border-coral/60 p-8 text-center">
                  <p className="text-micro uppercase tracking-[0.18em] text-coral-texto">
                    Canais de atendimento
                  </p>
                  <p className="mx-auto mt-3 max-w-[40ch] leading-[1.7] text-tinta-media">
                    WhatsApp, e-mail e Instagram entram aqui assim que forem
                    cadastrados em <code>lib/clara.ts</code>. Enquanto não
                    existirem, nenhum contato é exibido nem inventado.
                  </p>
                </div>
              )}
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
