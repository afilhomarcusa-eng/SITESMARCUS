import type { Metadata } from "next";
import Gerencia from "@/components/gerencia";

export const metadata: Metadata = {
  title: "Gerência do estoque",
  robots: { index: false, follow: false },
};

export default function PaginaAdmin() {
  return <Gerencia />;
}
