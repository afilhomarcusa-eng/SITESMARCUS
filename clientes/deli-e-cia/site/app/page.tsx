import Preloader from "@/components/preloader";
import Header from "@/components/header";
import Experience from "@/components/experience";
import HeroScene from "@/components/hero-scene";
import CategoryNav from "@/components/category-nav";
import DayTimeline from "@/components/day-timeline";
import Locations from "@/components/locations";
import Order from "@/components/order";
import MagneticLink from "@/components/magnetic-link";
import {Arrow,Photo,Star,Sun} from "@/components/ui";
import {brand,orderSteps,ribbonWords} from "@/lib/data";
export default function Page(){return <>
<Preloader/><noscript><style>{".preloader{display:none}"}</style></noscript><Header/><Experience/>
<main id="conteudo">
<section className="hero" id="deli" aria-labelledby="hero-title">
 <div className="hero-stage"><Photo id="hero" alt="Composição ilustrativa com pão, café e biscoitos sobre uma mesa clara" className="hero-photo" priority/><HeroScene/></div>
 <div className="hero-copy"><p className="eyebrow"><span className="small-sun"><Star/></span> DELICATESSEN EM SALVADOR</p><h1 id="hero-title">O seu dia.<br/><em>Em boa companhia.</em></h1><p className="hero-description">Pães de fermentação natural, café e empório.{" "}<br/>Para sentar à mesa ou levar um pouco da Deli com você.</p><div className="hero-actions"><MagneticLink href="#produtos" className="button button-red">Conheça a Deli <Arrow/></MagneticLink><a className="text-link" href="#unidades">Encontre uma unidade <Arrow diagonal/></a></div></div>
 <span className="hero-side-note">PÃO, CAFÉ & BOA COMPANHIA</span>
 <div className="hero-bottom"><span>SALVADOR, BAHIA</span><a href="#produtos">Sinta-se em casa <span>↓</span></a><span>COMPOSIÇÃO ILUSTRATIVA</span></div>
</section>
<div className="brand-ribbon" aria-hidden="true">{[0,1].map(track=><div className="ribbon-track" key={track}>{ribbonWords.map(word=><span key={word} className="ribbon-item">{word}<span className="ribbon-star"><Star/></span></span>)}</div>)}</div>
<section id="produtos" className="categories section-pad"><div className="section-top"><span className="eyebrow">01 / DO SEU JEITO</span><span className="tiny-note">PARA CADA VONTADE, UMA PARADA.</span></div><CategoryNav/></section>
<section className="bread-section" id="padaria"><div className="bread-photo-wrap"><Photo id="bread" alt="Imagem ilustrativa: pão de fermentação natural partido, com casca dourada e miolo aparente" className="bread-photo"/><span className="image-note light">FOTOGRAFIA ILUSTRATIVA</span><span className="bread-seal">Feito para<br/><em>repartir.</em></span></div><div className="bread-copy" data-reveal><span className="eyebrow">02 / DA PADARIA</span><h2>O tempo faz<br/><em>a diferença.</em></h2><p>Casca, miolo, textura. Há muito para gostar em um bom pão.</p><p>Os pães de fermentação natural fazem parte da seleção da Deli. Escolha o seu e decida o resto depois.</p><a className="text-link light-link" href="#unidades">Ver onde encontrar <Arrow diagonal/></a><div className="bread-footer"><span>FERMENTAÇÃO<br/>NATURAL</span><span className="fine-rule"/><span>DA DELI<br/>PARA A MESA</span></div></div></section>
<section className="day-section section-pad" id="cafe"><div className="day-heading"><span className="eyebrow">03 / A DELI AO LONGO DO DIA</span><h2>Tem sempre<br/><em>uma boa hora.</em></h2></div><DayTimeline/></section>
<section className="history section-pad" id="historia"><div className="history-top"><span className="eyebrow">04 / A NOSSA HISTÓRIA</span><span>SALVADOR, DESDE O COMEÇO.</span></div><div className="history-body"><div className="history-number">30<span>ANOS CELEBRADOS EM 2025</span></div><div className="history-copy" data-reveal><h2>O endereço muda.<br/>O jeito de receber<br/><em>continua.</em></h2><p>Em 2025, a Deli & Cia celebrou 30 anos de história e chegou ao Salvador Shopping. Uma nova parada em Salvador, com a mesma proposta acolhedora.</p><a className="text-link" href="#unidades">Venha fazer parte do dia <Arrow diagonal/></a></div></div><div className="history-rule"><span>PADARIA</span><span>DELICATESSEN</span><span>EMPÓRIO</span><span>BOA COMPANHIA</span></div></section>
<section className="locations-section section-pad" id="unidades"><div className="locations-heading"><div><span className="eyebrow">05 / PERTO DE VOCÊ</span><h2>A sua próxima<br/><em>parada.</em></h2></div><p>Escolha uma unidade.<br/>A gente te mostra o caminho.</p></div><Locations/></section>
<section className="order-section section-pad" id="pedir"><div className="order-title"><span className="eyebrow">06 / DELIDELIVERY</span><h2>Hoje, a Deli<br/><em>vai até você.</em></h2><p>A conversa é direta com quem está na loja. Cardápio, disponibilidade e entrega para o seu endereço.</p><ol className="order-steps">{orderSteps.map(step=><li key={step.n}><b>{step.n}</b><span>{step.text}</span></li>)}</ol></div><Order/></section>
<section className="social-section section-pad"><div className="social-mark" aria-hidden="true"><Sun/></div><div><span className="eyebrow">O QUE ESTÁ SAINDO POR AQUI</span><h2>A Deli também<br/>está no seu <em>feed.</em></h2><p>Produtos, novidades e o movimento da casa. Acompanhe no nosso Instagram.</p></div><a className="social-link" href={brand.instagram} target="_blank" rel="noopener noreferrer"><span>@delieciadelicatessen_</span><Arrow diagonal/></a></section>
</main>
<footer className="footer section-pad"><div className="footer-top"><a href="#deli" className="footer-wordmark" aria-label="Deli & Cia, voltar ao início">deli<span>&</span>cia</a><p>Pode chegar.<br/>A mesa está posta.</p><a href="#pedir" className="footer-cta">Fale com a Deli <Arrow diagonal/></a></div><div className="footer-bottom"><span>Deli & Cia Delicatessen · Salvador, BA</span><span>Imagens de alimentos e embalagem ilustrativas.</span><a href="#deli">Voltar ao topo ↑</a></div></footer>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Bakery",name:brand.name,areaServed:"Salvador, BA",sameAs:[brand.instagram],telephone:"+"+brand.whatsapp})}}/>
</>}