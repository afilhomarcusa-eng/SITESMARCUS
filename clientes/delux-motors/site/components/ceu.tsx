"use client";

import { useEffect, useRef } from "react";
import { DURACAO_ABERTURA } from "@/lib/abertura";

/**
 * O céu.
 *
 * A única fotografia real que existe da Delux Motors é a fachada em Boca do
 * Rio no fim da tarde, com o céu de Salvador aceso atrás. Este shader
 * reconstrói aquele céu, e ele é ao mesmo tempo o fundo do site e a abertura.
 *
 * A abertura é o horizonte nascendo: a tela começa no breu e a brasa sobe pela
 * borda de baixo até o céu inteiro assentar, que é quando o site já está lá.
 * Não existe corte entre abertura e herói, é a mesma imagem em dois momentos.
 *
 * Por que WebGL para um degradê: um céu ocupando a tela inteira em CSS mostra
 * faixas, porque o navegador interpola em 8 bits sem ruído. Aqui o grão entra
 * antes da quantização e o degradê fica limpo, que é a diferença entre parecer
 * um céu e parecer um plano de fundo.
 */

type Props = {
  /**
   * Roda a subida do horizonte. Quem decide isso é o herói, em lib/abertura.ts,
   * porque o relógio da abertura não pode depender do pacote do three chegar.
   * Aqui só se anima o céu.
   */
  abertura: boolean;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTempo;
  uniform float uSobe;   // 0 = breu, 1 = céu assentado
  uniform vec2  uRes;

  // Cores medidas na foto da fachada, em 07/09/2026.
  const vec3 ALTO  = vec3(0.043, 0.036, 0.055); // topo, quase breu violeta
  const vec3 MEIO  = vec3(0.286, 0.220, 0.271); // malva do céu alto
  const vec3 BRASA = vec3(0.941, 0.741, 0.627); // horizonte aceso

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float ruido(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Nuvem de fim de tarde: camadas de ruído esticadas na horizontal, porque
  // nuvem de horizonte é larga e baixa, não redonda.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * ruido(p);
      p = p * 2.03 + 17.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float razao = uRes.x / max(uRes.y, 1.0);

    // O horizonte sobe durante a abertura e para baixo, perto da borda.
    // Num pôr do sol de verdade a faixa acesa é estreita: o resto do céu é
    // escuro. A primeira versão espalhava a brasa por dois terços da tela e o
    // resultado era névoa cor de pêssego, não entardecer.
    float h = mix(-0.34, 0.10, uSobe);

    // Deriva lenta, quase parada. Céu que corre vira protetor de tela.
    vec2 p = vec2(uv.x * razao * 1.6 + uTempo * 0.008, uv.y * 2.4);
    float nuvens = fbm(p);

    // A altura da nuvem empurra o degradê um pouco para cima e para baixo,
    // então a borda entre malva e brasa deixa de ser uma reta.
    float ondula = (nuvens - 0.5) * 0.09;
    float y = uv.y + ondula;

    // O malva só começa na metade de baixo. Em cima é quase breu, que é onde
    // o texto do herói pousa.
    float paraMeio  = smoothstep(0.78, h + 0.10, y);
    float paraBrasa = smoothstep(h + 0.26, h - 0.04, y);

    vec3 cor = ALTO;
    cor = mix(cor, MEIO, paraMeio * 0.8);
    cor = mix(cor, BRASA, pow(clamp(paraBrasa, 0.0, 1.0), 1.8) * 0.9);

    // As nuvens acendem numa faixa curta logo acima do horizonte.
    float acende = smoothstep(h + 0.34, h + 0.03, y) * smoothstep(0.46, 0.74, nuvens);
    cor += vec3(0.30, 0.14, 0.08) * acende * 0.55;

    // Sombra na esquerda, que é onde fica a coluna de texto do herói. A brasa
    // fica concentrada à direita, do lado da foto, e o texto ganha chão escuro.
    float coluna = smoothstep(0.70, 0.0, uv.x);
    cor *= 1.0 - coluna * 0.62;

    // Grão de filme. Entra antes da quantização, e é ele que tira as faixas
    // do degradê. Sem isto o céu inteiro fica listrado.
    float grao = hash(uv * uRes + fract(uTempo) * 91.7) - 0.5;
    cor += grao * 0.016;

    // A abertura escurece tudo no começo, então a brasa aparece sozinha.
    cor *= mix(0.15, 1.0, smoothstep(0.0, 0.55, uSobe));

    gl_FragColor = vec4(cor, 1.0);
  }
`;

export default function Ceu({ abertura }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // O import do three é assíncrono, então dentro dele o TypeScript já não
    // sabe que host continua existindo. Fixa a referência aqui.
    const alvo: HTMLDivElement = host;

    let cancelado = false;
    let limpar: (() => void) | undefined;
    // O three entra por import dinâmico para não pesar o primeiro carregamento.
    // Se falhar, o degradê em CSS que está atrás continua valendo.
    import("three")
      .then((THREE) => {
        if (cancelado) return;

        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
        } catch {
          // Placa sem WebGL: o degradê de CSS que está no fundo assume.
          return;
        }

        const rodar = abertura;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(alvo.clientWidth, alvo.clientHeight);
        alvo.appendChild(renderer.domElement);
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

        const cena = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
          uTempo: { value: 0 },
          uSobe: { value: rodar ? 0 : 1 },
          uRes: { value: new THREE.Vector2(alvo.clientWidth, alvo.clientHeight) },
        };
        const malha = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.ShaderMaterial({
            vertexShader: VERT,
            fragmentShader: FRAG,
            uniforms,
            depthTest: false,
            depthWrite: false,
          }),
        );
        cena.add(malha);

        function medir() {
          const l = alvo.clientWidth;
          const a = alvo.clientHeight;
          renderer.setSize(l, a);
          uniforms.uRes.value.set(l * renderer.getPixelRatio(), a * renderer.getPixelRatio());
        }
        medir();

        // O primeiro gesto encerra a subida do horizonte, igual ao herói.
        let pulou = false;
        const pular = () => {
          pulou = true;
        };
        if (rodar) {
          for (const ev of ["pointerdown", "wheel", "keydown", "touchstart"] as const) {
            window.addEventListener(ev, pular, { once: true, passive: true });
          }
        }

        let t0 = 0;
        let raf = 0;
        let visivel = true;

        const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting), {
          threshold: 0,
        });
        obs.observe(alvo);

        // Saída exponencial: sobe rápido e assenta devagar, como luz caindo.
        const facil = (x: number) => 1 - Math.pow(1 - x, 3.2);

        function quadro(agora: number) {
          raf = requestAnimationFrame(quadro);
          if (!visivel) return;
          if (!t0) t0 = agora;
          uniforms.uTempo.value = (agora - t0) / 1000;

          if (rodar) {
            const p = pulou ? 1 : Math.min(1, (agora - t0) / DURACAO_ABERTURA);
            uniforms.uSobe.value = facil(p);
          }
          renderer.render(cena, camera);
        }
        raf = requestAnimationFrame(quadro);

        window.addEventListener("resize", medir);

        limpar = () => {
          cancelAnimationFrame(raf);
          obs.disconnect();
          window.removeEventListener("resize", medir);
          for (const ev of ["pointerdown", "wheel", "keydown", "touchstart"] as const) {
            window.removeEventListener(ev, pular);
          }
          malha.geometry.dispose();
          (malha.material as import("three").Material).dispose();
          renderer.dispose();
          alvo.replaceChildren();
        };
      })
      .catch(() => {
        // Sem three fica o degradê de CSS. O conteúdo do herói não depende
        // disto: quem revela é o relógio do próprio herói.
      });

    return () => {
      cancelado = true;
      limpar?.();
    };
  }, [abertura]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        /* Fallback: se o WebGL não subir, ainda existe céu, só sem o grão.
           Repete as duas camadas do shader, inclusive a sombra da esquerda,
           senão a foto do herói fica com a borda aparecendo contra um fundo
           que não combina com ela. */
        background:
          "linear-gradient(to right, rgba(8,7,10,0.62) 0%, rgba(8,7,10,0.25) 44%, transparent 72%), linear-gradient(to top, #e0ab92 0%, #8d6a70 12%, #493a4a 34%, #14101a 64%, #08070a 100%)",
      }}
    />
  );
}
