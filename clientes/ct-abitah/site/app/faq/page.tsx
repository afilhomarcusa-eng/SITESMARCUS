import { FaqEntries } from "@/components/faq-index";
import { Footer, Header } from "@/components/chrome";

const questions = [
  ["Preciso já treinar para fazer uma aula?", "Não. A aula experimental é justamente para você conhecer o método, o professor e o ritmo da turma, seja qual for o seu nível."],
  ["Como funciona a aula experimental?", "Escolha a unidade mais perto de você e fale com a equipe pelo WhatsApp. Eles combinam o melhor horário e explicam tudo antes da primeira aula."],
  ["Quais modalidades posso fazer?", "O CT Abitah tem Funcional, Performance, Spinning, Corrida, Weekend e Abitah Day. A disponibilidade pode variar por unidade."],
  ["Posso treinar em outra unidade?", "Sim. A rede tem oito unidades em Salvador, Lauro de Freitas e Feira de Santana. Confirme as regras do seu plano com a equipe."],
  ["O que preciso levar?", "Roupas confortáveis, tênis e uma garrafinha de água. Chegue alguns minutos antes para conhecer o espaço e o professor."],
  ["A academia funciona aos domingos?", "Algumas unidades abrem aos domingos e aos sábados. Consulte a página da unidade escolhida para ver os horários atualizados."],
  ["Como falar com uma unidade?", "Na página de Unidades, escolha o endereço e use o botão de WhatsApp. Você fala direto com quem atende naquele espaço."],
];

export default function FaqPage() { return <main><Header/><section className="faq-hero"><div className="shell"><span className="tag">Perguntas frequentes</span><h1>Antes de começar, <em>pergunte.</em></h1><p>As respostas mais importantes para você chegar à primeira aula com tranquilidade.</p></div></section><section className="faq-list section"><div className="shell"><div className="faq-intro"><span className="tag">Sem complicar</span><p>Se a sua dúvida não estiver aqui, a equipe da unidade mais próxima responde pelo WhatsApp.</p></div><FaqEntries entries={questions.map(([question, answer], i) => [question, ["Para quem começa", "Primeiro encontro", "Modalidades", "Unidades", "Dia de treino", "Funcionamento", "Primeiro passo"][i], answer])} /></div></section><Footer/></main>; }
