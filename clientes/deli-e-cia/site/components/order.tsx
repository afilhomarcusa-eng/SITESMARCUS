"use client";
import {useState} from "react";
import {WhatsApp} from "./ui";
import {locations,orderUrl} from "@/lib/data";
export default function Order(){
 const [unit,setUnit]=useState("");
 const chosen=locations.find(u=>u.name===unit);
 return <div className="order-card order-form">
  <span className="order-note">CONVERSA DIRETA COM A LOJA</span>
  <label htmlFor="unidade">De qual unidade</label>
  <select id="unidade" value={unit} onChange={e=>setUnit(e.target.value)}>
   <option value="">Ainda não sei</option>
   {locations.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}
  </select>
  <p className="order-echo">{chosen?chosen.address+" · "+chosen.city:"A gente ajuda a escolher a mais perto de você."}</p>
  <a className="button" href={orderUrl(unit||undefined)} target="_blank" rel="noopener noreferrer">Abrir a conversa no WhatsApp <WhatsApp/></a>
  <p>A mensagem abre pronta, com a sua escolha escrita. Você só envia.</p>
 </div>
}
