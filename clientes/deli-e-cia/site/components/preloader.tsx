"use client";
import {useEffect,useState} from "react";
const word="deli&cia".split("");
export default function Preloader(){
 const [state,setState]=useState<"idle"|"playing"|"leaving"|"gone">("idle");
 useEffect(()=>{
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seen=true;
  try{seen=!!sessionStorage.getItem("deli-visited");sessionStorage.setItem("deli-visited","1")}catch{}
  if(seen||reduce){setState("gone");return}
  document.body.style.overflow="hidden";
  const leave=setTimeout(()=>setState("leaving"),1250);
  const done=setTimeout(()=>{setState("gone");document.body.style.overflow="";window.dispatchEvent(new Event("deli:entered"))},2050);
  setState("playing");
  return()=>{clearTimeout(leave);clearTimeout(done);document.body.style.overflow=""};
 },[]);
 if(state==="gone")return null;
 return <div className="preloader" data-state={state} aria-hidden="true">
  <div className="preloader-inner">
   <span className="preloader-mark"><img src="/images/logo-255.webp" width="255" height="255" alt=""/></span>
   <span className="preloader-word">{word.map((letter,i)=><span key={i} className={letter==="&"?"preloader-amp":undefined} style={{animationDelay:.34+i*.055+"s"}}>{letter}</span>)}</span>
   <span className="preloader-rule"/>
   <span className="preloader-note">TRINTA ANOS EM SALVADOR</span>
  </div>
 </div>
}
