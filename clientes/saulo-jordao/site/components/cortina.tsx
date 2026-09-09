import { SCRIPT_PULAR } from "@/lib/abertura";

export default function Cortina() {
  return (
    <>
      <div className="cortina preloader" aria-hidden="true">
        <div className="preloader-sketch">
          <svg viewBox="0 0 720 220" fill="none">
            <path className="sketch-main" pathLength="1" d="M64 153c49-7 78-26 111-52 33-26 68-44 128-48 77-5 137 17 196 70 46 3 92 12 151 33" />
            <path className="sketch-detail" pathLength="1" d="M178 102c46 10 83 13 126 13h202M92 155l-23 19m581-18 17 17" />
            <path className="sketch-detail sketch-wheels" pathLength="1" d="M153 161a43 43 0 0 1 84 0m250 0a43 43 0 0 1 84 0" />
            <circle className="sketch-light" cx="628" cy="146" r="2.5" />
            <circle className="sketch-light" cx="638" cy="148" r="1.5" />
          </svg>
          <div className="preloader-brand">
            <strong>Saulo Jordão</strong>
            <span>Curadoria automotiva · Aracaju, SE</span>
          </div>
        </div>
        <i className="preloader-rule" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_PULAR }} />
    </>
  );
}
