import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUnidade, unidades } from "@/lib/unidades";
import { UnidadeView } from "./view";

export function generateStaticParams() {
  return unidades.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const u = getUnidade((await params).slug);
  if (!u) return {};
  return {
    title: `Abitah ${u.nome} · ${u.cidade}`,
    description: `${u.sobre} Fica em ${u.endereco}, ${u.bairro}, ${u.cidade}.`,
    openGraph: { title: `Abitah ${u.nome}`, description: u.destaque, locale: "pt_BR", type: "website" },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const u = getUnidade((await params).slug);
  if (!u) notFound();
  return <UnidadeView unidade={u} />;
}
