import type { Metadata } from "next";
import { Form } from "./form";

export const metadata: Metadata = {
  title: "Aula experimental · Abitah Centro de Treinamento",
  description:
    "Escolha a unidade, conte o seu objetivo e a mensagem chega pronta no WhatsApp de quem atende ali. Oito unidades na Bahia.",
};

export default function Page() {
  return <Form />;
}
