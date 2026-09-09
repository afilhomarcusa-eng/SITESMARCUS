"use client";
// Adapted from motion-primitives-website/src/components/effects/magnetic-button.tsx.
// Retains its motion-value/spring interaction; uses semantic links and reduced motion.
import {useRef} from "react";
import {motion,useMotionValue,useSpring,useReducedMotion} from "motion/react";
export default function MagneticLink({href,children,className=""}:{href:string;children:React.ReactNode;className?:string}){
 const ref=useRef<HTMLAnchorElement>(null),x=useMotionValue(0),y=useMotionValue(0),reduce=useReducedMotion();
 const springX=useSpring(x,{stiffness:190,damping:24}),springY=useSpring(y,{stiffness:190,damping:24});
 return <motion.a ref={ref} href={href} className={className} style={{x:springX,y:springY}} onMouseMove={e=>{if(reduce||!matchMedia("(pointer:fine)").matches)return;const r=ref.current!.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)*.07);y.set((e.clientY-r.top-r.height/2)*.07)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.a>
}