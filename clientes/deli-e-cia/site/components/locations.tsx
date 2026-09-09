"use client";
import "leaflet/dist/leaflet.css";
import {useEffect,useRef,useState} from "react";
import {Arrow,Sun} from "./ui";
import {locations,orderUrl} from "@/lib/data";
type LMap=import("leaflet").Map;
type LMarker=import("leaflet").Marker;
const hoursOf=(hours:string|null)=>hours??"Horários não confirmados. Pergunte pelo WhatsApp antes de sair de casa.";
export default function Locations(){
 const [active,setActive]=useState(0),[state,setState]=useState<"loading"|"ready"|"failed">("loading"),[swiped,setSwiped]=useState(false);
 const node=useRef<HTMLDivElement>(null),map=useRef<LMap|null>(null),marks=useRef<LMarker[]>([]);
 useEffect(()=>{
  let cancelled=false;
  (async()=>{
   try{
    const L=(await import("leaflet")).default;
    if(cancelled||!node.current)return;
    const instance=L.map(node.current,{scrollWheelZoom:false,zoomControl:false}).setView([locations[0].lat,locations[0].lng],13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'Mapa &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(instance);
    L.control.zoom({position:"topright",zoomInTitle:"Aproximar",zoomOutTitle:"Afastar"}).addTo(instance);
    marks.current=locations.map((unit,i)=>L.marker([unit.lat,unit.lng],{title:unit.name,alt:"Unidade "+unit.name,icon:L.divIcon({className:"deli-marker",html:'<span><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.8v18.4M3.2 12h17.6M5.8 5.8l12.4 12.4M18.2 5.8 5.8 18.2"/></svg></b></span>',iconSize:[36,36],iconAnchor:[18,34]})}).addTo(instance).bindTooltip(unit.name,{direction:"top",offset:[0,-32]}).on("click",()=>setActive(i)));
    map.current=instance;
    setState("ready");
   }catch{if(!cancelled)setState("failed")}
  })();
  return()=>{cancelled=true;map.current?.remove();map.current=null;marks.current=[]};
 },[]);
 useEffect(()=>{
  marks.current.forEach((mark,i)=>mark.getElement()?.classList.toggle("active",i===active));
  if(!map.current)return;
  const unit=locations[active],reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce)map.current.setView([unit.lat,unit.lng],15);else map.current.flyTo([unit.lat,unit.lng],15,{duration:.9});
 },[active,state]);
 const showAll=()=>{const instance=map.current;if(!instance)return;instance.fitBounds(locations.map(u=>[u.lat,u.lng] as [number,number]),{padding:[60,60]})};
 const unit=locations[active];
 return <div className="locations-layout">
  <div className="map-wrap">
   <div className="leaflet-map" ref={node} role="application" aria-label={"Mapa com as "+locations.length+" unidades da Deli em Salvador"}/>
   {state!=="ready"&&<div className="map-cover"><Sun/><span>{state==="loading"?"Carregando o mapa":"Mapa indisponível"}</span></div>}
   {state==="failed"&&<p className="map-failure">O mapa não carregou. Os endereços estão aqui do lado e o caminho abre no Google Maps.</p>}
   <span className="map-badge">{locations.length} UNIDADES EM SALVADOR</span>
   {state==="ready"&&<button className="map-reset" onClick={showAll}>Ver todas</button>}
  </div>
  <div className="location-panel">
   <div className="location-tabs" role="tablist" aria-label="Unidades">{locations.map((u,i)=>
    <button key={u.id} role="tab" id={"unidade-"+u.id} aria-selected={i===active} aria-controls="painel-unidade" tabIndex={i===active?0:-1} onClick={()=>setActive(i)}>{u.name}</button>)}
   </div>
   <div className="unit-info" id="painel-unidade" role="tabpanel" aria-labelledby={"unidade-"+unit.id}>
    <span className="unit-index">UNIDADE 0{active+1} / 0{locations.length}</span>
    <h3>{unit.name}</h3>
    <p className="floor">{unit.floor} · {unit.area}</p>
    <address>{unit.address}<br/>{unit.city}</address>
    <p className="unit-hours">{hoursOf(unit.hours)}</p>
    <p className="unit-services">{unit.services.join(" · ")}</p>
    <div className="unit-actions">
     <a className="button button-red" href={orderUrl(unit.name)} target="_blank" rel="noopener noreferrer">Falar com a unidade <Arrow/></a>
     <a className="text-link" href={unit.directions} target="_blank" rel="noopener noreferrer">Como chegar <Arrow diagonal/></a>
    </div>
    <a className="unit-source" href={unit.source} target="_blank" rel="noopener noreferrer">{unit.sourceLabel}</a>
    {unit.id==="salvador"&&<figure className="unit-photo"><img src="/images/store-255.webp" width="255" height="180" alt="Fachada do Salvador Shopping"/><figcaption>SALVADOR SHOPPING, ONDE FICA A UNIDADE</figcaption></figure>}
   </div>
   <p className="swipe-hint" data-hidden={swiped}>Arraste para ver as outras unidades <Arrow/></p>
   <div className="mobile-unit-list" onScroll={e=>{if(e.currentTarget.scrollLeft>16)setSwiped(true)}}>{locations.map((u,i)=>
    <article key={u.id} className={"unit-card-mobile"+(i===active?" active":"")}>
     <span className="unit-index">UNIDADE 0{i+1}</span>
     <h3><button onClick={()=>setActive(i)} aria-pressed={i===active}>{u.name}</button></h3>
     <span className="floor">{u.floor} · {u.area}</span>
     <address>{u.address}<br/>{u.city}</address>
     <p className="unit-hours">{hoursOf(u.hours)}</p>
     <div className="unit-actions">
      <a className="button button-red" href={orderUrl(u.name)} target="_blank" rel="noopener noreferrer">Falar com a unidade <Arrow/></a>
      <a className="text-link" href={u.directions} target="_blank" rel="noopener noreferrer">Como chegar <Arrow diagonal/></a>
     </div>
     <a className="unit-source" href={u.source} target="_blank" rel="noopener noreferrer">{u.sourceLabel}</a>
    </article>)}
   </div>
  </div>
 </div>
}
