"use client";
import {useRef,useState} from "react";
import {Arrow} from "./ui";
import {categories} from "@/lib/data";
export default function CategoryNav(){
 const [active,setActive]=useState(0),list=useRef<HTMLDivElement>(null),current=categories[active];
 const move=(e:React.KeyboardEvent,i:number)=>{const step=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0;if(!step)return;e.preventDefault();const next=(i+step+categories.length)%categories.length;setActive(next);list.current?.querySelectorAll("button")[next]?.focus()};
 return <>
 <div className="category-intro"><h2>Quatro jeitos<br/><em>de estar aqui.</em></h2><p>Escolha por onde começar. O resto do dia se resolve na mesa.</p></div>
 <div className="category-list" role="tablist" aria-label="Áreas da Deli" ref={list}>{categories.map((c,i)=>
  <button key={c.id} role="tab" id={"tab-"+c.id} aria-selected={i===active} aria-controls="painel-categoria" tabIndex={i===active?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>move(e,i)}><div className="cat-body"><small>{c.index}</small><span>{c.name}</span><em>{c.note}</em></div><Arrow diagonal/></button>)}
 </div>
 <div className="category-detail" id="painel-categoria" role="tabpanel" aria-labelledby={"tab-"+current.id} key={current.id}><p>{current.text}</p><a className="text-link" href={current.href}>{current.link} <Arrow/></a></div>
 </>
}
