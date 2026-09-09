import { Hero } from "@/components/hero";
import { Sobre } from "@/components/sobre";
import { Atendimento } from "@/components/atendimento";
import { ComoComeca } from "@/components/como-comeca";
import { Duvidas } from "@/components/duvidas";
import { Contato } from "@/components/contato";
import { Fecho } from "@/components/fecho";
import { Revelacao } from "@/components/revelacao";

export default function Pagina() {
  return (
    <>
      <Hero />
      <Sobre />
      <Atendimento />
      <ComoComeca />
      <Duvidas />
      <Contato />
      <Fecho />
      <Revelacao />
    </>
  );
}
