"use client";
import {useState} from "react";
import {Arrow,Photo,Sun} from "./ui";
import {dayParts} from "@/lib/data";
export default function DayTimeline(){
 const [active,setActive]=useState(0),part=dayParts[active];
 return <div className="day-layout">
  <div className={"day-image "+part.id}><Photo id="coffee" alt="Imagem ilustrativa: xícara de café expresso, uma fatia de bolo e biscoitos sobre a mesa, com Salvador ao fundo"/><span className="image-note">IMAGEM ILUSTRATIVA</span></div>
  <div className="day-content">
   <div className="day-tabs" role="tablist" aria-label="A Deli ao longo do dia">{dayParts.map((p,i)=>
    <button key={p.id} role="tab" id={"hora-"+p.id} aria-selected={i===active} aria-controls="painel-hora" tabIndex={i===active?0:-1} onClick={()=>setActive(i)}>{p.tab}</button>)}
   </div>
   <div className="day-icon" aria-hidden="true"><Sun/></div>
   <div className="day-text" id="painel-hora" role="tabpanel" aria-labelledby={"hora-"+part.id}><h3>{part.title}</h3><p>{part.text}</p><a className="text-link" href="#pedir">{part.link} <Arrow diagonal/></a></div>
   <div className="day-bottom"><span>DE MANHÃ · À TARDE · À NOITE</span><span>PADARIA, CAFÉ E EMPÓRIO</span></div>
  </div>
 </div>
}
