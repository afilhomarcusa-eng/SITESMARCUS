export function Arrow({ diagonal = false, className = "" }: { diagonal?: boolean; className?: string }) {
  return <svg aria-hidden="true" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"} /></svg>;
}
export function Wordmark() {
  return <span className="wordmark"><span>thadeu<span className="brand-slash">/</span></span><span>melo<span className="wordmark-team">TEAM</span></span></span>;
}
// As raias da pista são o único elemento gráfico do site. Elas abrem a cortina em
// close, param exatamente na posição do herói e voltam a se fechar no CTA final.
export function Track({ className = "", lanes = 7, width = 1.3 }: { className?: string; lanes?: number; width?: number }) {
  return <svg className={className} aria-hidden="true" viewBox="0 0 700 700" fill="none" preserveAspectRatio="xMidYMid slice"><g stroke="currentColor" strokeWidth={width}>{Array.from({ length: lanes }, (_, i) => <path key={i} d={`M ${-150 + i * 37} 760 V ${370 + i * 15} C ${-150 + i * 37} ${10 + i * 15}, ${640 - i * 37} ${10 + i * 15}, ${640 - i * 37} ${370 + i * 15} V 790`} />)}</g></svg>;
}
