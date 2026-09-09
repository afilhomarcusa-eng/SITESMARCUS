"use client";
import {useEffect} from "react";
export default function Experience(){
 useEffect(()=>{
  const root=document.documentElement;
  let timer:ReturnType<typeof setTimeout>|undefined;
  const finish=()=>root.classList.remove("intro-playing");
  const start=()=>{root.classList.add("intro-playing");const image=document.querySelector<HTMLImageElement>(".hero-photo");timer=setTimeout(finish,image?.complete?1500:2400)};
  window.addEventListener("deli:entered",start,{once:true});
  const dismiss=()=>finish();["pointerdown","keydown","wheel","touchstart"].forEach(event=>window.addEventListener(event,dismiss,{once:true,passive:true}));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in-view");observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el));
  return()=>{clearTimeout(timer);finish();observer.disconnect();window.removeEventListener("deli:entered",start);["pointerdown","keydown","wheel","touchstart"].forEach(event=>window.removeEventListener(event,dismiss))};
 },[]);
 return <div className="intro-signature" aria-hidden="true"><span>Entre. A mesa está posta.</span><span className="intro-line"/></div>
}
