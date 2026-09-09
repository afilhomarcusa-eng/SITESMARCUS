import type { Metadata } from "next";
import Gerencia from "@/components/gerencia";
import { bancoExiste, lerEstoqueFresco } from "@/lib/banco";

/** A gerência nunca é cacheada nem indexada. */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Gerência",
  robots: { index: false, follow: false },
};

export default async function Admin() {
  const [carros, existe] = await Promise.all([lerEstoqueFresco(), bancoExiste()]);
  return (
    <main id="conteudo" className="faixa" style={{ paddingBlock: "var(--e5)" }}>
      <Gerencia inicial={carros} usandoSemente={!existe} />
    </main>
  );
}
