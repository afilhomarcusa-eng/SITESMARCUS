/**
 * Dados de contato da cliente.
 *
 * Regra do briefing: campo vazio remove o elemento do site.
 * Cada campo `null` faz o botão, link ou seção correspondente desaparecer.
 * Quando a Roberta mandar o dado, troca o `null` pelo valor e o elemento volta sozinho.
 */

export const contato = {
  nome: "Roberta Dantas",
  profissao: "Psicóloga",
  registro: "CRP 19/4572",
  cidade: "Aracaju",
  estado: "Sergipe",

  instagram: "robertadantaspsi",

  // Pendentes. Preencher quando ela enviar.
  whatsapp: null as string | null, // formato: "5579999999999"
  telefone: null as string | null, // formato: "5579999999999"
  email: null as string | null,
  endereco: null as string | null,
  horario: null as string | null,
} as const;

export const links = {
  instagram: contato.instagram
    ? `https://instagram.com/${contato.instagram}`
    : null,

  whatsapp: contato.whatsapp
    ? `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(
        "Oi Roberta, vim pelo site e queria saber sobre atendimento."
      )}`
    : null,

  telefone: contato.telefone ? `tel:+${contato.telefone}` : null,
  email: contato.email ? `mailto:${contato.email}` : null,
} as const;

/** Canal principal de agendamento. Cai para o Instagram enquanto não há WhatsApp. */
export const canalPrincipal = links.whatsapp
  ? { href: links.whatsapp, rotulo: "Chamar no WhatsApp" }
  : links.instagram
    ? { href: links.instagram, rotulo: "Chamar no Instagram" }
    : null;
