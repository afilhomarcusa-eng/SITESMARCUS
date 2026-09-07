"use client";

import { useEffect, useRef } from "react";
import { DURACAO_ABERTURA } from "@/lib/abertura";

/**
 * O céu.
 *
 * É o céu de Salvador que aparece nas fotos do estoque: os carros deles são
 * fotografados de dia, no pátio da loja, com o céu aberto atrás. Este shader
 * reconstrói aquele céu, e ele é ao mesmo tempo o fundo do herói e a abertura.
 *
 * A abertura é o dia chegando: a tela começa numa luz baixa e morna, a
 * claridade sobe pela borda de baixo e o céu abre até assentar, que é quando o
 * site já está lá. Não existe corte entre abertura e herói, é a mesma imagem em
 * dois momentos.
 *
 * O degradê termina exatamente na cor de fundo da página, então a emenda entre
 * o herói e a primeira seção não aparece.
 *
 * Por que WebGL para um degradê: um céu ocupando a tela inteira em CSS mostra
 * faixas, porque o navegador interpola em 8 bits sem ruído. Aqui o grão entra
 * antes da quantização e o degradê fica limpo, que é a diferença entre parecer
 * um céu e parecer um plano de fundo.
 */

type Props = {
  /**
   * Roda a subida da claridade. Quem decide isso é o herói, em lib/abertura.ts,
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
  uniform float uSobe;   // 0 = luz baixa, 1 = dia assentado
  uniform vec2  uRes;

  // Cores medidas nas fotos do estoque, em 07/09/2026.
  const vec3 ALTO  = vec3(0.760, 0.855, 0.918); // céu aberto sobre o pátio
  const vec3 MEIO  = vec3(0.906, 0.882, 0.847); // a bruma quente perto do chão
  const vec3 BAIXO = vec3(0.949, 0.937, 0.918); // fecha na cor da página

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

  // Nuvem larga e baixa, esticada na horizontal, que é como nuvem de horizonte
  // se comporta. Nada de bolha redonda.
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

    // A claridade sobe durante a abertura e para no lugar dela.
    float h = mix(-0.35, 0.34, uSobe);

    // Deriva lenta, quase parada. Céu que corre vira protetor de tela.
    vec2 p = vec2(uv.x * razao * 1.5 + uTempo * 0.006, uv.y * 2.2);
    float nuvens = fbm(p);

    // A nuvem ondula a borda entre as faixas, então ela deixa de ser uma reta
    // atravessando a tela.
    float y = uv.y + (nuvens - 0.5) * 0.08;

    float paraMeio  = smoothstep(0.86, h + 0.12, y);
    float paraBaixo = smoothstep(h + 0.30, h - 0.16, y);

    vec3 cor = ALTO;
    cor = mix(cor, MEIO, paraMeio);
    cor = mix(cor, BAIXO, clamp(paraBaixo, 0.0, 1.0));

    // Nuvem alta, clara, discreta. Some perto do chão.
    float alta = smoothstep(0.45, 0.85, nuvens) * smoothstep(h + 0.10, 0.92, y);
    cor = mix(cor, vec3(0.98, 0.97, 0.96), alta * 0.35);

    // Um respiro de brasa logo acima do horizonte, que é a cor da marca.
    float quente = smoothstep(h + 0.26, h - 0.02, y) * smoothstep(0.40, 0.72, nuvens);
    cor = mix(cor, vec3(0.85, 0.62, 0.47), quente * 0.16);

    // Grão de filme. Entra antes da quantização, e é ele que tira as faixas do
    // degradê. Sem isto o céu inteiro fica listrado.
    float grao = hash(uv * uRes + fract(uTempo) * 91.7) - 0.5;
    cor += grao * 0.012;

    // A abertura começa com a luz baixa e morna, e abre para o dia.
    float luz = smoothstep(0.0, 0.7, uSobe);
    cor = mix(cor * vec3(0.72, 0.63, 0.58), cor, luz);

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
    // Se falhar, o degradê de CSS que está no fundo continua valendo, e o
    // conteúdo do herói não depende disto: quem revela é o relógio do herói.
    import("three")
      .then((THREE) => {
        if (cancelado) return;

        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
        } catch {
          return;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(alvo.clientWidth, alvo.clientHeight);
        alvo.appendChild(renderer.domElement);
        renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

        const cena = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const uniforms = {
          uTempo: { value: 0 },
          uSobe: { value: abertura ? 0 : 1 },
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
          uniforms.uRes.value.set(
            l * renderer.getPixelRatio(),
            a * renderer.getPixelRatio(),
          );
        }
        medir();

        // O primeiro gesto encerra a subida, igual ao relógio do herói.
        let pulou = false;
        const pular = () => {
          pulou = true;
        };
        if (abertura) {
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

        // Saída exponencial: sobe rápido e assenta devagar, como luz abrindo.
        const facil = (x: number) => 1 - Math.pow(1 - x, 3.2);

        function quadro(agora: number) {
          raf = requestAnimationFrame(quadro);
          if (!visivel) return;
          if (!t0) t0 = agora;
          uniforms.uTempo.value = (agora - t0) / 1000;

          if (abertura) {
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
        /* sem three, fica o degradê de CSS */
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
           Repete as faixas do shader e fecha na cor da página, para a emenda
           com a primeira seção não aparecer. */
        background:
          "linear-gradient(to top, #f2efea 0%, #f2efea 12%, #e7ddd2 30%, #dfe6ea 62%, #c2d8e9 100%)",
      }}
    />
  );
}
