"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  /** 0 → topo do hero, 1 → hero fora da tela. Controlado pela página. */
  scroll: React.RefObject<number>;
  lowPower: boolean;
}

/**
 * Coroa cromada inspirada no logotipo da BGOD, com um halo de cerâmica preta orbitando.
 * Toda a geometria é procedural (sem arquivos .glb) e os reflexos vêm de um estúdio
 * virtual com Lightformers — nada de HDR externo para baixar.
 */
export default function HaloScene({ scroll, lowPower }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Pausa a renderização quando o hero sai da tela.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={lowPower ? [1, 1.25] : [1, 1.75]}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.2, 6.4], fov: 32 }}
        aria-hidden
      >
        <Crown scroll={scroll} lowPower={lowPower} />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.6} scale={9} blur={2.4} far={3.6} resolution={lowPower ? 256 : 512} color="#000000" />
        <Environment resolution={lowPower ? 128 : 256} frames={1}>
          <Studio />
        </Environment>
      </Canvas>
    </div>
  );
}

function Studio() {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      {/* Softbox principal (topo) */}
      <Lightformer form="rect" intensity={3.2} position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
      {/* Faixas laterais — desenham os reflexos verticais longos no cromo */}
      <Lightformer form="rect" intensity={2.6} position={[-5, 0.5, -1]} rotation-y={Math.PI / 2} scale={[0.6, 8, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[5, 0.5, -2]} rotation-y={-Math.PI / 2} scale={[0.4, 8, 1]} />
      {/* Contraluz fria e preenchimento quente, bem sutis */}
      <Lightformer form="ring" intensity={0.9} color="#e8ecf2" position={[2, 1, -6]} scale={3} />
      <Lightformer form="rect" intensity={0.6} color="#f2e6d8" position={[-3, -3, 3]} scale={[4, 1, 1]} />
    </>
  );
}

const POINTS = 5;
const BAND_R = 1;

/** Perfil da faixa da coroa (raio, altura) — com frisos salientes em cima e embaixo. */
function bandProfile() {
  const pts: [number, number][] = [
    [0.93, -0.26],
    [1.04, -0.26],
    [1.08, -0.22],
    [1.08, -0.15],
    [1.03, -0.12],
    [1.03, 0.12],
    [1.08, 0.15],
    [1.08, 0.22],
    [1.04, 0.26],
    [0.93, 0.26],
    [0.93, -0.26],
  ];
  return pts.map(([x, y]) => new THREE.Vector2(x * BAND_R, y));
}

/** Silhueta de uma ponta da coroa: base larga, laterais côncavas e topo afilado. */
function spikeShape() {
  const s = new THREE.Shape();
  const w = 0.24;
  const h = 0.78;
  s.moveTo(-w, 0);
  s.quadraticCurveTo(-w * 0.15, h * 0.35, 0, h);
  s.quadraticCurveTo(w * 0.15, h * 0.35, w, 0);
  s.lineTo(-w, 0);
  return s;
}

function Crown({ scroll, lowPower }: Props) {
  const group = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  const mobile = size.width < 768;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const seg = lowPower ? 64 : 128;

  const { chrome, ceramic, band, spike, jewel } = useMemo(() => {
    const chrome = new THREE.MeshPhysicalMaterial({
      color: "#dadada",
      metalness: 1,
      roughness: 0.07,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.4,
    });
    const ceramic = new THREE.MeshPhysicalMaterial({
      color: "#0a0a0a",
      metalness: 0.2,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.1,
    });
    const band = new THREE.LatheGeometry(bandProfile(), seg);
    const spike = new THREE.ExtrudeGeometry(spikeShape(), {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: lowPower ? 2 : 5,
      curveSegments: lowPower ? 8 : 20,
    });
    spike.translate(0, 0, -0.025);
    const jewel = new THREE.SphereGeometry(1, seg / 4, seg / 4);
    return { chrome, ceramic, band, spike, jewel };
  }, [seg, lowPower]);

  useEffect(
    () => () => {
      [chrome, ceramic, band, spike, jewel].forEach((r) => r.dispose());
    },
    [chrome, ceramic, band, spike, jewel],
  );

  const points = useMemo(
    () => Array.from({ length: POINTS }, (_, i) => (i / POINTS) * Math.PI * 2),
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = scroll.current ?? 0;

    // Cursor: inclinação amortecida. Rolagem: a coroa sobe, inclina e recua.
    const targetX = 0.32 + pointer.current.y * 0.14 + s * 0.6;
    const targetZ = -pointer.current.x * 0.12;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetZ, 3, delta);
    g.position.y = Math.sin(t * 0.6) * 0.06 + s * 0.8 - 0.05;
    const scale = (mobile ? 0.72 : 1) * (1 - s * 0.15);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale, 4, delta));

    // Rotação lenta e contínua da coroa, acelerada levemente pela rolagem.
    if (crown.current) crown.current.rotation.y = t * 0.18 + pointer.current.x * 0.35 + s * 1.2;
    if (halo.current) {
      halo.current.rotation.z = t * 0.1;
      halo.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.05;
    }
  });

  return (
    <group ref={group} position={[mobile ? 0 : 1.05, 0, 0]}>
      <group ref={crown}>
        <mesh geometry={band} material={chrome} />
        {points.map((a) => (
          <group key={a} rotation={[0, a, 0]}>
            {/* Ponta inclinada levemente para fora, apoiada no friso superior */}
            <group position={[0, 0.22, BAND_R * 1.0]} rotation={[-0.16, 0, 0]}>
              <mesh geometry={spike} material={chrome} />
              <mesh geometry={jewel} material={chrome} position={[0, 0.84, 0]} scale={0.085} />
            </group>
            {/* Gema de cerâmica preta na faixa */}
            <mesh geometry={jewel} material={ceramic} position={[0, 0, BAND_R * 1.06]} scale={[0.075, 0.075, 0.04]} />
          </group>
        ))}
      </group>
      <mesh ref={halo} material={ceramic} position={[0, 0.45, -0.1]}>
        <torusGeometry args={[1.75, 0.035, seg / 4, seg * 2]} />
      </mesh>
    </group>
  );
}
