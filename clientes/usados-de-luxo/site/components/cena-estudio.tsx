"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A sala.
 *
 * O site inteiro nasce de uma observação sobre o cliente: todo carro do estoque
 * é fotografado no mesmo lugar, parede preta texturizada, piso claro, luz
 * rasante entrando de lado. Esta cena reconstrói esse lugar em 3D de verdade e
 * coloca a fotografia real dentro dele.
 *
 * Os planos:
 *   fundo  a parede, em CSS, com a tipografia monumental do herói por cima
 *   meio   a foto do carro, com paralaxe de profundidade no shader
 *   frente o feixe de luz, que passa na frente de tudo
 *
 * Aqui já teve um U em relevo, em 3D, na frente da cena. Saiu. Letra dourada
 * flutuando no herói é exatamente o clichê que o briefing proíbe, e na prática
 * ela virava um borrão escuro atrás do título. O que faz a cena parecer
 * espacial não é um objeto: é a relação entre câmera, tipografia, foto e luz.
 *
 * A profundidade da foto sai da luminância. Funciona porque a fotografia deles
 * é sempre a mesma: assunto claro sobre fundo escuro. O que é claro está perto,
 * o que é escuro está longe. Com isso o carro ganha volume quando a câmera anda,
 * em vez de virar adesivo chapado.
 */

type Props = {
  /** Caminho da foto do carro que fica no meio da cena. */
  foto: string;
  /** Roda a abertura. Quando falso, a cena já começa acesa. */
  abertura: boolean;
  /** Avisa o progresso da abertura, de 0 a 1, para o DOM acompanhar. */
  onProgresso?: (t: number) => void;
  /** Dispara quando a textura entrou e a cena tem o que mostrar. */
  onPronto?: () => void;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * A luz na parede.
 *
 * A parede em si é CSS, atrás do canvas. Aqui só entra a luz, somada por cima,
 * porque entre a parede e este canvas existe a tipografia monumental em DOM.
 * Se este plano fosse opaco ele apagaria esse texto, e é justamente a foto
 * passando na frente dele que constrói a profundidade.
 */
const FRAG_LUZ = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTempo;
  uniform float uAcende;

  void main() {
    vec2 uv = vUv;

    // Luz rasante entrando pela esquerda alta, como no estúdio deles.
    float faixa = 1.0 - smoothstep(0.0, 0.92, distance(uv, vec2(0.16, 0.9)));
    float varredura = smoothstep(0.3, 1.0, faixa);

    // Respiro lento, quase imperceptível.
    varredura *= 0.9 + sin(uTempo * 0.25) * 0.1;

    vec3 cor = vec3(0.3, 0.27, 0.22) * varredura;
    gl_FragColor = vec4(cor * uAcende, varredura * uAcende);
  }
`;

/**
 * A foto. Faz três coisas: paralaxe por profundidade, a varredura de luz da
 * abertura, e o esmaecimento das bordas para a foto dissolver na sala em vez
 * de ficar com cara de quadro pendurado.
 */
const FRAG_FOTO = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uMapa;
  uniform vec2 uParalaxe;
  uniform float uRevela;
  uniform float uAcende;

  float luminancia(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 uv = vUv;

    // Primeira leitura só para descobrir o que está perto.
    float lum = luminancia(texture2D(uMapa, uv).rgb);
    float profundidade = smoothstep(0.10, 0.70, lum);

    // O que é claro anda mais que o que é escuro. Isso é o volume.
    vec2 desloca = uParalaxe * (profundidade - 0.32);
    vec4 cor = texture2D(uMapa, uv + desloca);

    // A luz varrendo na abertura: uma borda dura descendo pela diagonal.
    // Em uRevela = 0 nada apareceu, em uRevela = 1.2 já apareceu tudo.
    // As bordas do smoothstep precisam ficar em ordem crescente, senão o
    // resultado é indefinido em GLSL e a foto nunca chega.
    float diagonal = uv.x * 0.42 + (1.0 - uv.y) * 0.58;
    float frente = 1.0 - smoothstep(uRevela - 0.18, uRevela, diagonal);
    // Crista quente em cima da borda, como luz batendo na lataria.
    float crista = (1.0 - smoothstep(0.0, 0.09, abs(diagonal - uRevela))) * 0.45;

    vec3 rgb = cor.rgb * frente + vec3(0.82, 0.69, 0.38) * crista * frente;

    // Bordas macias: a foto precisa virar sala, não quadro pendurado.
    // O pé some num trecho mais longo porque o piso é claro, e piso claro que
    // termina numa reta entrega a moldura na hora.
    float lados = (1.0 - smoothstep(0.52, 0.99, abs(uv.x - 0.5) * 2.0));
    float topo = smoothstep(1.0, 0.82, uv.y);
    float pe = smoothstep(0.0, 0.34, uv.y);
    float mascara = lados * topo * pe;

    // O alfa também entra em frente. Sem isso, a parte ainda não revelada sai
    // preta e opaca, virando um retângulo preto por cima da composição.
    gl_FragColor = vec4(rgb * uAcende, mascara * frente);
  }
`;

export default function CenaEstudio({ foto, abertura, onProgresso, onPronto }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  // As funções entram por ref para o efeito da cena não precisar delas nas
  // dependências e remontar o WebGL inteiro a cada renderização do pai.
  // A escrita acontece em efeito, nunca durante a renderização.
  const progressoRef = useRef(onProgresso);
  const prontoRef = useRef(onPronto);

  useEffect(() => {
    progressoRef.current = onProgresso;
    prontoRef.current = onPronto;
  }, [onProgresso, onPronto]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Sem WebGL o componente simplesmente não monta e o fallback estático,
    // que já está no DOM atrás dele, continua valendo.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const largura = () => host.clientWidth;
    const altura = () => host.clientHeight;

    // O 3D subiu. Avisa agora, não quando a textura chegar: o fallback estático
    // precisa sair antes de a abertura começar, senão dá para ver a foto
    // aparecer e sumir antes da luz acender.
    prontoRef.current?.();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(largura(), altura());
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%";

    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, largura() / altura(), 0.1, 100);

    // ------------------------------------------------------------------ luz
    const uLuz = {
      uTempo: { value: 0 },
      uAcende: { value: abertura && !reduzido ? 0 : 1 },
    };
    const luzParede = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 18),
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_LUZ,
        uniforms: uLuz,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    luzParede.position.z = -7;
    cena.add(luzParede);

    // ------------------------------------------------------------------ foto
    const uFoto = {
      uMapa: { value: null as THREE.Texture | null },
      uParalaxe: { value: new THREE.Vector2(0, 0) },
      uRevela: { value: abertura && !reduzido ? 0 : 1.2 },
      uAcende: { value: 1 },
    };
    const RAZAO = 1440 / 1800;
    const ALT_FOTO = 5.1;
    const planoFoto = new THREE.Mesh(
      new THREE.PlaneGeometry(ALT_FOTO * RAZAO, ALT_FOTO, 1, 1),
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_FOTO,
        uniforms: uFoto,
        transparent: true,
        depthWrite: false,
      }),
    );
    planoFoto.position.set(0.35, -0.15, -1.4);
    cena.add(planoFoto);

    const carregador = new THREE.TextureLoader();
    carregador.load(foto, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      uFoto.uMapa.value = t;
    });

    // ------------------------------------------------------------- feixe
    const feixe = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffe6b0,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    feixe.position.set(-1.2, 0, 2.2);
    feixe.rotation.z = 0.34;
    cena.add(feixe);

    // ------------------------------------------------------- enquadramento
    // A cena foi composta em 1440. Em telas largas a câmera recua um pouco,
    // senão o carro vira um objeto pequeno no meio de um oceano de fundo.
    function enquadrar() {
      const l = largura();
      const a = altura();
      camera.aspect = l / a;
      const estreito = l < 900;
      const base = estreito ? 9.9 : 8.4;
      // Compensa telas largas e baixas.
      const ajuste = THREE.MathUtils.clamp(1.55 - l / a / 1.9, 0, 0.85);
      camera.position.set(0, estreito ? 0.05 : 0.2, base + ajuste * 2.1);
      camera.lookAt(0, estreito ? 0.05 : -0.05, -1);
      camera.updateProjectionMatrix();

      // Em tela larga o carro vai para a direita e libera a coluna de texto.
      // Em tela estreita ele volta para o meio, porque ali o texto fica em cima
      // e não do lado.
      // No mobile o texto ocupa a parte de cima, então o carro desce para a
      // metade de baixo. Sobrepor os dois no celular não é composição, é o
      // layout de desktop espremido.
      //
      // Descer sem encolher não resolve: o plano tem 5,1 de altura e sai pela
      // base da tela, sobrando só a parede escura do topo da foto. Por isso ele
      // encolhe junto, para o carro inteiro caber na metade de baixo.
      planoFoto.scale.setScalar(estreito ? 0.62 : 1);
      planoFoto.position.x = estreito ? 0.1 : 2.5;
      planoFoto.position.y = estreito ? -1.55 : -0.15;

      renderer.setSize(l, a);
    }
    enquadrar();

    // ---------------------------------------------------------------- mouse
    const alvo = new THREE.Vector2(0, 0);
    const suave = new THREE.Vector2(0, 0);
    const fino = window.matchMedia("(pointer: fine)").matches;

    function onMouse(e: PointerEvent) {
      alvo.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    }
    if (fino && !reduzido) window.addEventListener("pointermove", onMouse, { passive: true });

    // ------------------------------------------------------------- abertura
    // Roda uma vez por sessão. Recarregar não repete.
    const jaViu = sessionStorage.getItem("udl:abriu") === "1";
    const rodarAbertura = abertura && !reduzido && !jaViu;
    let t0 = 0;
    let pulou = false;
    const DUR = 3000;

    function pular() {
      pulou = true;
    }
    if (rodarAbertura) {
      // Marca assim que começa, não quando termina. Quem sai da página no meio
      // da abertura não deve ver ela de novo na mesma sessão.
      sessionStorage.setItem("udl:abriu", "1");
      window.addEventListener("pointerdown", pular, { once: true, passive: true });
      window.addEventListener("wheel", pular, { once: true, passive: true });
      window.addEventListener("keydown", pular, { once: true });
      window.addEventListener("touchstart", pular, { once: true, passive: true });
    } else {
      progressoRef.current?.(1);
      sessionStorage.setItem("udl:abriu", "1");
    }

    const facil = (x: number) => 1 - Math.pow(1 - x, 3);

    // ----------------------------------------------------------------- loop
    let raf = 0;
    let visivel = true;
    const obs = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
      },
      { threshold: 0 },
    );
    obs.observe(host);

    let ultimoAviso = -1;

    function quadro(agora: number) {
      raf = requestAnimationFrame(quadro);
      if (!visivel) return;
      if (!t0) t0 = agora;

      const seg = (agora - t0) / 1000;
      uLuz.uTempo.value = seg;

      // Progresso da abertura.
      let p = 1;
      if (rodarAbertura && !pulou) {
        p = Math.min(1, (agora - t0) / DUR);
      } else if (rodarAbertura && pulou) {
        p = 1;
      }
      const e = facil(p);

      if (rodarAbertura) {
        uLuz.uAcende.value = THREE.MathUtils.clamp(p / 0.28, 0, 1);
        uFoto.uRevela.value = THREE.MathUtils.clamp((p - 0.24) / 0.52, 0, 1) * 1.2;
        feixe.material.opacity = Math.sin(Math.min(p, 1) * Math.PI) * 0.22;
        // A câmera recua: começa colada na parede e abre para o enquadramento.
        camera.position.z += (1 - e) * 0.02;

        const passo = Math.round(p * 100) / 100;
        if (passo !== ultimoAviso) {
          ultimoAviso = passo;
          progressoRef.current?.(p);
        }
      }

      // Depois que a abertura termina, o mouse volta a valer inteiro.
      const parado = rodarAbertura ? e : 1;

      // Mouse com amortecimento. Nunca ligado direto no transform.
      suave.lerp(alvo, 0.045);
      const forca = parado;
      camera.rotation.y = -suave.x * 0.013 * forca;
      camera.rotation.x = suave.y * 0.009 * forca;
      uFoto.uParalaxe.value.set(-suave.x * 0.009 * forca, suave.y * 0.006 * forca);

      renderer.render(cena, camera);
    }
    raf = requestAnimationFrame(quadro);

    const onResize = () => enquadrar();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMouse);
      window.removeEventListener("pointerdown", pular);
      window.removeEventListener("wheel", pular);
      window.removeEventListener("keydown", pular);
      window.removeEventListener("touchstart", pular);
      cena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      uFoto.uMapa.value?.dispose();
      renderer.dispose();
      host.replaceChildren();
    };
  }, [foto, abertura]);

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0" />;
}
