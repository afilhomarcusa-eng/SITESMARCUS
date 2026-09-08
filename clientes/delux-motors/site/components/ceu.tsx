"use client";

import { useEffect, useRef } from "react";

/**
 * O céu.
 *
 * É o céu de Salvador que aparece nas fotos do estoque, em preto e branco,
 * como o resto da interface. Os carros deles são fotografados de dia, no pátio
 * da loja, com o céu aberto atrás. Este shader reconstrói aquela luz sem a cor,
 * e ele é o fundo do herói.
 *
 * Este componente NÃO participa da abertura, e isso é de propósito. Ele
 * desenha sempre o céu assentado, e pode chegar quando quiser: o pacote do
 * three é assíncrono e ninguém sabe quando ele baixa. Enquanto não chega, o
 * degradê de CSS que está no fundo mostra o mesmo céu, então a troca não
 * aparece.
 *
 * Quem faz a abertura é o véu do herói, com o relógio de lib/abertura.ts. Já
 * tentamos animar o céu junto e o resultado foi os dois começarem em momentos
 * diferentes, com o conteúdo abrindo antes de o céu terminar.
 *
 * O degradê termina exatamente na cor de fundo da página, então a emenda entre
 * o herói e a primeira seção não aparece.
 *
 * Por que WebGL para um degradê: um céu ocupando a tela inteira em CSS mostra
 * faixas, porque o navegador interpola em 8 bits sem ruído. Aqui o grão entra
 * antes da quantização e o degradê fica limpo, que é a diferença entre parecer
 * um céu e parecer um plano de fundo.
 */

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
  uniform vec2  uRes;

  // Sem cor, só luz. Os tons vieram da luminância das fotos do estoque.
  const vec3 ALTO  = vec3(0.855, 0.855, 0.852); // o alto, mais fechado
  const vec3 MEIO  = vec3(0.941, 0.941, 0.937); // a bruma perto do chão
  const vec3 BAIXO = vec3(1.000, 1.000, 1.000); // fecha no branco da página

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

    // A altura do horizonte. Fixa: o céu não anima, quem anima é o véu.
    const float h = 0.34;

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
    cor = mix(cor, vec3(0.985), alta * 0.4);

    // Uma sombra rasa logo acima do horizonte, para a faixa não ser uma chapa.
    float sombra = smoothstep(h + 0.26, h - 0.02, y) * smoothstep(0.40, 0.72, nuvens);
    cor = mix(cor, vec3(0.90), sombra * 0.22);

    // Grão de filme. Entra antes da quantização, e é ele que tira as faixas do
    // degradê. Sem isto o céu inteiro fica listrado.
    float grao = hash(uv * uRes + fract(uTempo) * 91.7) - 0.5;
    cor += grao * 0.012;

    gl_FragColor = vec4(cor, 1.0);
  }
`;

export default function Ceu() {
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

        let t0 = 0;
        let raf = 0;
        let visivel = true;

        const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting), {
          threshold: 0,
        });
        obs.observe(alvo);

        function quadro(agora: number) {
          raf = requestAnimationFrame(quadro);
          if (!visivel) return;
          if (!t0) t0 = agora;
          uniforms.uTempo.value = (agora - t0) / 1000;
          renderer.render(cena, camera);
        }
        raf = requestAnimationFrame(quadro);

        window.addEventListener("resize", medir);

        limpar = () => {
          cancelAnimationFrame(raf);
          obs.disconnect();
          window.removeEventListener("resize", medir);
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
  }, []);

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
          "linear-gradient(to top, #ffffff 0%, #ffffff 14%, #f6f6f5 34%, #eeeeed 64%, #dadad8 100%)",
      }}
    />
  );
}
