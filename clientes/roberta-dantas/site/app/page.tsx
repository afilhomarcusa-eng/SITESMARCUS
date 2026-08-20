import { contato, links, canalPrincipal } from "@/lib/contato";
import { MagneticLink } from "@/components/magnetic-link";
import { Entrada } from "@/components/entrada";
import { Parallax } from "@/components/parallax";
import { ScrollSuave } from "@/components/scroll-suave";
import {
  SectionReveal,
  RevealLista,
  RevealItem,
} from "@/components/section-reveal";

/* Wrapper de largura. Um só, para o ritmo horizontal não variar sem motivo. */
function Faixa({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[76rem] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-marca border border-papel-borda bg-papel-fundo px-2.5 py-1 text-micro uppercase tracking-[0.18em] text-tinta-fraca">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="grao">
      <ScrollSuave />

      {/* ────────────── Hero · 0 a 10% · entrada em cascata ────────────── */}
      <section className="relative overflow-hidden pb-[var(--space-normal)] pt-24 md:pt-32">
        <Faixa>
          {/* Assimetria: conteúdo ocupa 9 de 12 colunas e para antes da margem direita */}
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-9">
              <Entrada>
                <p className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-mini uppercase tracking-[0.22em] text-tinta-fraca">
                  <span>{contato.profissao}</span>
                  <span aria-hidden className="text-sage">
                    ·
                  </span>
                  <span>{contato.registro}</span>
                  <span aria-hidden className="text-sage">
                    ·
                  </span>
                  <span>
                    {contato.cidade}, {contato.estado}
                  </span>
                </p>
              </Entrada>

              <Entrada delay={0.08}>
                <h1 className="font-display text-display font-normal leading-[0.94] tracking-[-0.025em]">
                  Você fala.
                  <br />
                  <span className="text-sage-escuro">
                    Eu escuto o que veio junto.
                  </span>
                </h1>
              </Entrada>

              <Entrada delay={0.16}>
                <p className="mt-10 max-w-[36ch] text-medio leading-[1.5] text-tinta-media">
                  Psicanálise em Aracaju e online, para quem já cansou de
                  resolver a mesma coisa duas vezes por ano.
                </p>
              </Entrada>
            </div>
          </div>

          {canalPrincipal && (
            <Entrada delay={0.24}>
              <div className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <MagneticLink href={canalPrincipal.href}>
                  {canalPrincipal.rotulo}
                </MagneticLink>
                <p className="max-w-[28ch] text-mini leading-[1.6] text-tinta-fraca">
                  Presencial no consultório ou online, de onde você estiver.
                </p>
              </div>
            </Entrada>
          )}
        </Faixa>
      </section>

      {/* ────────────── O problema · 10 a 25% · revelação por bloco ────────────── */}
      <section className="fio bg-papel-fundo py-[var(--space-normal)]">
        <Faixa>
          <SectionReveal className="grid grid-cols-12 gap-y-10">
            <div className="col-span-12 md:col-span-4">
              <Etiqueta>Por que agora</Etiqueta>
            </div>

            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-titulo font-normal leading-[1.08] tracking-[-0.02em]">
                Tem uma coisa que sempre volta
              </h2>

              <div className="mt-8 space-y-6 text-medio leading-[1.6] text-tinta-media">
                <p>
                  Você já tentou sozinho. Leu sobre o assunto e conversou com
                  quem estava por perto, e por um tempo isso deu conta.
                </p>
                <p>
                  Depois volta. Costuma voltar no mesmo ponto e com o mesmo
                  peso, num momento em que você já achava que aquilo tinha
                  ficado para trás.
                </p>
                <p className="text-tinta">
                  A psicanálise trabalha com o que insiste em voltar.
                </p>
              </div>
            </div>
          </SectionReveal>
        </Faixa>
      </section>

      {/* ────────────── Citação. Sangra na largura toda. ────────────── */}
      <section className="border-y border-papel-borda bg-sage-escuro py-[var(--space-apertado)]">
        <Faixa>
          <blockquote className="max-w-[24ch] font-display text-grande leading-[1.25] tracking-[-0.01em] text-papel md:max-w-[34ch]">
            Eu entendo as suas razões, mas eu não posso esquecer das minhas.
          </blockquote>
        </Faixa>
      </section>

      {/* ────────────── Como eu atendo · 25 a 45% · parallax só no fundo ────────────── */}
      <section className="relative overflow-hidden py-[var(--space-normal)]">
        {/* Arco de fundo. Único elemento que se move nesta seção. */}
        <Parallax
          speed={0.35}
          className="pointer-events-none absolute right-[-6rem] top-0 -z-10 hidden lg:block"
          aria-hidden
        >
          <div className="h-[30rem] w-[22rem] rounded-t-full border border-sage-tenue opacity-60" />
        </Parallax>

        <Faixa>
          <Etiqueta>Formatos</Etiqueta>

          <h2 className="mt-8 max-w-[18ch] font-display text-titulo font-normal leading-[1.08] tracking-[-0.02em]">
            Duas formas de sentar para conversar
          </h2>

          {/* Duas colunas de larguras diferentes, não um grid de cards iguais */}
          <div className="mt-14 grid grid-cols-12 gap-y-12 md:gap-x-10">
            <div className="col-span-12 md:col-span-7">
              <p className="font-display text-grande leading-[1.2] text-sage-escuro">
                Presencial
              </p>
              <p className="mt-4 max-w-[38ch] leading-[1.65] text-tinta-media">
                No consultório, em {contato.cidade}. O horário é marcado e é só
                seu.
              </p>
            </div>

            <div className="col-span-12 md:col-span-5">
              <p className="font-display text-grande leading-[1.2] text-sage-escuro">
                Online
              </p>
              <p className="mt-4 max-w-[34ch] leading-[1.65] text-tinta-media">
                Por vídeo, de onde você estiver. O trabalho é o mesmo do
                presencial, sem o trajeto até o consultório.
              </p>
            </div>
          </div>
        </Faixa>
      </section>

      {/* ────────────── Como funciona · 45 a 65% · cascata de 80ms ────────────── */}
      <section className="fio bg-papel-fundo py-[var(--space-normal)]">
        <Faixa>
          <div className="grid grid-cols-12 gap-y-12">
            <SectionReveal className="col-span-12 md:col-span-4">
              <Etiqueta>Primeiro passo</Etiqueta>
              <h2 className="mt-8 max-w-[14ch] font-display text-titulo font-normal leading-[1.08] tracking-[-0.02em]">
                Começa com uma mensagem
              </h2>
            </SectionReveal>

            <RevealLista className="col-span-12 md:col-span-7 md:col-start-6">
              {[
                {
                  n: "01",
                  t: "Você escreve",
                  d: "Conta em poucas linhas o que te trouxe até aqui. Não precisa estar organizado, e quase nunca está.",
                },
                {
                  n: "02",
                  t: "A gente marca a primeira sessão",
                  d: "Ela serve para você me conhecer e para eu entender o que você procura. Nada fica decidido nesse dia.",
                },
                {
                  n: "03",
                  t: "Você decide",
                  d: "Se fizer sentido seguir, a gente combina a frequência. Se não fizer, tudo bem também.",
                },
              ].map((passo) => (
                <RevealItem
                  key={passo.n}
                  className="fio flex gap-6 py-8 first:border-t-0 first:pt-0"
                >
                  <span className="pt-1 font-display text-medio text-sage">
                    {passo.n}
                  </span>
                  <div>
                    <p className="font-display text-grande leading-[1.2]">
                      {passo.t}
                    </p>
                    <p className="mt-3 max-w-[44ch] leading-[1.65] text-tinta-media">
                      {passo.d}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealLista>
          </div>
        </Faixa>
      </section>

      {/* ────────────── Diferencial. Seção deslocada do grid. ────────────── */}
      <section className="py-[var(--space-largo)]">
        <Faixa>
          <div className="grid grid-cols-12">
            {/* Começa na coluna 4, deixa um vão largo à esquerda */}
            <SectionReveal className="col-span-12 md:col-span-8 md:col-start-4">
              <Etiqueta>Formação</Etiqueta>

              <h2 className="mt-8 font-display text-titulo font-normal leading-[1.08] tracking-[-0.02em]">
                Duas formações que não se substituem
              </h2>

              <div className="mt-8 space-y-6 text-medio leading-[1.6] text-tinta-media">
                <p>
                  Minha primeira pós graduação é em psicologia hospitalar e da
                  saúde. É o campo que estuda o sofrimento quando ele aparece
                  colado ao corpo e ao diagnóstico, num contexto onde quase tudo
                  precisa ser decidido rápido.
                </p>
                <p>
                  A segunda, que estou concluindo, é em psicanálise. É o
                  percurso que orienta como eu escuto hoje.
                </p>
                <p className="text-tinta">
                  As duas continuam aparecendo no consultório.
                </p>
              </div>

              <p className="mt-10 text-mini uppercase tracking-[0.18em] text-tinta-fraca">
                {contato.registro}
              </p>
            </SectionReveal>
          </div>
        </Faixa>
      </section>

      {/* ────────────── Objeções ────────────── */}
      <section className="fio bg-papel-fundo py-[var(--space-normal)]">
        <Faixa>
          <Etiqueta>Antes de mandar mensagem</Etiqueta>

          <h2 className="mt-8 max-w-[20ch] font-display text-titulo font-normal leading-[1.08] tracking-[-0.02em]">
            O que costuma travar na hora de escrever
          </h2>

          <RevealLista className="mt-14 grid grid-cols-12 gap-y-10 md:gap-x-10">
            {[
              {
                p: "Nunca fiz terapia.",
                r: "Isso ajuda mais do que atrapalha. Você não precisa chegar sabendo o que dizer nem por onde começar, porque essa parte é minha.",
              },
              {
                p: "Não sei se o que eu tenho é grave o bastante.",
                r: "Não existe fila por gravidade. Se está ocupando espaço na sua semana, já é motivo.",
              },
              {
                p: "Online funciona igual?",
                r: "Sim. A conversa é a mesma, o que muda é o trajeto até ela.",
              },
              {
                p: "E se eu travar no meio?",
                r: "Travar faz parte do processo. O silêncio dentro da sessão também diz alguma coisa, e a gente trabalha com ele.",
              },
            ].map((item) => (
              <RevealItem key={item.p} className="col-span-12 md:col-span-6">
                <p className="font-display text-grande leading-[1.25] text-sage-escuro">
                  {item.p}
                </p>
                <p className="mt-3 max-w-[42ch] leading-[1.65] text-tinta-media">
                  {item.r}
                </p>
              </RevealItem>
            ))}
          </RevealLista>
        </Faixa>
      </section>

      {/* ────────────── Contato. Zero movimento aqui. ────────────── */}
      <section className="py-[var(--space-largo)]">
        <Faixa>
          <div className="grid grid-cols-12">
            <div className="col-span-12 lg:col-span-8">
              <h2 className="font-display text-titulo font-normal leading-[1.05] tracking-[-0.02em]">
                Vamos trilhar esse caminho juntos?
              </h2>

              <p className="mt-6 max-w-[40ch] text-medio leading-[1.55] text-tinta-media">
                Manda uma mensagem contando o que você quiser contar. Pode ser
                uma linha só.
              </p>

              {canalPrincipal && (
                <div className="mt-12">
                  <MagneticLink href={canalPrincipal.href}>
                    {canalPrincipal.rotulo}
                  </MagneticLink>
                </div>
              )}

              {/* Só aparece o que existe em lib/contato.ts */}
              <ul className="fio mt-14 space-y-3 pt-8 text-mini text-tinta-fraca">
                {links.telefone && (
                  <li>
                    <a className="hover:text-tinta" href={links.telefone}>
                      Telefone
                    </a>
                  </li>
                )}
                {links.email && (
                  <li>
                    <a className="hover:text-tinta" href={links.email}>
                      {contato.email}
                    </a>
                  </li>
                )}
                {contato.endereco && <li>{contato.endereco}</li>}
                {contato.horario && <li>{contato.horario}</li>}
              </ul>
            </div>
          </div>
        </Faixa>
      </section>

      {/* ────────────── Rodapé ────────────── */}
      <footer className="fio bg-sage-escuro py-14 text-papel">
        <Faixa>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-grande leading-[1.1]">
                {contato.nome}
              </p>
              <p className="mt-2 text-mini uppercase tracking-[0.18em] text-sage-claro">
                {contato.profissao} · {contato.registro}
              </p>
              <p className="mt-1 text-mini text-sage-claro">
                {contato.cidade}, {contato.estado}
              </p>
            </div>

            {links.instagram && (
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mini uppercase tracking-[0.18em] text-sage-claro underline decoration-1 underline-offset-4 transition-colors hover:text-papel"
              >
                @{contato.instagram}
              </a>
            )}
          </div>
        </Faixa>
      </footer>
    </main>
  );
}
