"use client";
// Embalagem conceitual em WebGL. Substituir pelo modelo real quando a Deli enviar a sacola.
import {useEffect,useRef} from "react";
export default function HeroScene(){
 const holder=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=holder.current;if(!host)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame=0,stop=()=>{};
  (async()=>{
   try{
    const THREE=await import("three");
    if(!host.clientWidth||!host.clientHeight)return;
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"low-power"});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,host.clientWidth/host.clientHeight,.1,60);
    camera.position.set(0,0,7.2);
    scene.add(new THREE.HemisphereLight(0xfff2df,0x8a5a3b,2.1));
    const key=new THREE.DirectionalLight(0xfff6ea,2.4);key.position.set(3.5,5,4);scene.add(key);
    const paper=new THREE.MeshStandardMaterial({color:0xdcb375,roughness:.92}),folded=new THREE.MeshStandardMaterial({color:0xc79f60,roughness:.95}),cord=new THREE.MeshStandardMaterial({color:0xa87f4a,roughness:.8});
    const bag=new THREE.Group();
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.7,2.3,.95),paper);
    const lip=new THREE.Mesh(new THREE.BoxGeometry(1.76,.3,1.01),folded);lip.position.y=1.2;
    const handleGeometry=new THREE.TorusGeometry(.3,.035,10,26,Math.PI);
    const front=new THREE.Mesh(handleGeometry,cord);front.position.set(0,1.34,.3);
    const back=new THREE.Mesh(handleGeometry,cord);back.position.set(0,1.34,-.3);
    const labelGeometry=new THREE.CircleGeometry(.44,48),labelMaterial=new THREE.MeshBasicMaterial({transparent:true,color:0xf6f0e6});
    const label=new THREE.Mesh(labelGeometry,labelMaterial);label.position.set(0,.2,.476);
    bag.add(body,lip,front,back,label);bag.rotation.set(.05,-.5,.04);scene.add(bag);
    const render=()=>renderer.render(scene,camera);
    new THREE.TextureLoader().load("/images/logo-255.webp",texture=>{texture.colorSpace=THREE.SRGBColorSpace;labelMaterial.map=texture;labelMaterial.color.set(0xffffff);labelMaterial.needsUpdate=true;if(reduce)render()});
    const resize=()=>{if(!host.clientWidth||!host.clientHeight)return;renderer.setSize(host.clientWidth,host.clientHeight,false);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();render()};
    const observer=new ResizeObserver(resize);observer.observe(host);
    let time=0;
    const loop=()=>{time+=.006;bag.rotation.y=-.5+Math.sin(time)*.32;bag.position.y=Math.sin(time*1.7)*.06;render();frame=requestAnimationFrame(loop)};
    if(reduce)render();else loop();
    host.classList.add("ready");host.parentElement?.classList.add("webgl-ready");
    stop=()=>{observer.disconnect();[body,lip,front,back,label].forEach(mesh=>mesh.geometry.dispose());[paper,folded,cord,labelMaterial].forEach(material=>material.dispose());renderer.dispose();renderer.domElement.remove()};
   }catch{}
  })();
  return()=>{cancelAnimationFrame(frame);stop()};
 },[]);
 return <>
  <div className="bag-fallback"><img src="/images/logo-255.webp" width="255" height="255" alt=""/></div>
  <div className="hero-canvas" ref={holder} aria-hidden="true"/>
 </>
}
