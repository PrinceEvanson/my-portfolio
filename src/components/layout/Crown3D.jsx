import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

// Requires: npm i three @react-three/fiber @react-three/drei

// Metal colour. Lime keeps the crown matching the green dot it becomes.
// For classic gold, try "#d4af37".
const METAL = "#c6ff3d";
const VELVET = "#3b2a8f";
const GEMS = ["#ff2d6f", "#38e1ff", "#7c5cff", "#ff2d6f", "#38e1ff"];

const TALL = 0.62; // height of the big peaks
const SHORT = 0.34; // height of the small peaks between them

// A curved, tapering horn (lathe = a profile spun around the Y axis).
function hornGeometry(height, baseRadius) {
  const pts = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = baseRadius * Math.pow(1 - t, 1.5) * (1 + 0.35 * Math.sin(t * Math.PI)) + 0.002;
    pts.push(new THREE.Vector2(r, t * height));
  }
  return new THREE.LatheGeometry(pts, 28);
}

// The band: a flared ring with real thickness and a rounded lip, as one lathe profile.
function bandGeometry() {
  const pts = [
    [0.5, 0.0],
    [0.515, 0.015],
    [0.522, 0.045],
    [0.537, 0.2],
    [0.558, 0.38],
    [0.566, 0.41],
    [0.562, 0.425],
    [0.548, 0.43],
    [0.536, 0.415],
    [0.515, 0.2],
    [0.497, 0.045],
    [0.49, 0.015],
    [0.5, 0.0],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const g = new THREE.LatheGeometry(pts, 96);
  g.computeVertexNormals();
  return g;
}

function Crown() {
  const spin = useRef();

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 1.2;
  });

  const parts = useMemo(() => {
    const metal = new THREE.MeshStandardMaterial({
      color: METAL,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.7,
    });
    const pearl = new THREE.MeshPhysicalMaterial({
      color: "#f6f3ea",
      roughness: 0.18,
      metalness: 0,
      clearcoat: 1,
      iridescence: 1,
      iridescenceIOR: 1.3,
    });
    const velvet = new THREE.MeshPhysicalMaterial({
      color: VELVET,
      roughness: 1,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color("#a894ff"),
      side: THREE.DoubleSide,
    });
    const gems = GEMS.map(
      (c) =>
        new THREE.MeshPhysicalMaterial({
          color: c,
          transmission: 0.92,
          thickness: 0.5,
          roughness: 0.02,
          ior: 2.3,
          attenuationColor: new THREE.Color(c),
          attenuationDistance: 0.5,
          envMapIntensity: 2.2,
        })
    );

    const peaks = [];
    for (let i = 0; i < 5; i++) {
      peaks.push({ a: (i / 5) * Math.PI * 2, tall: true });
      peaks.push({ a: ((i + 0.5) / 5) * Math.PI * 2, tall: false });
    }

    return {
      metal,
      pearl,
      velvet,
      gems,
      peaks,
      band: bandGeometry(),
      tall: hornGeometry(TALL, 0.1),
      short: hornGeometry(SHORT, 0.075),
    };
  }, []);

  const { metal, pearl, velvet, gems, peaks, band, tall, short } = parts;

  return (
    <group position={[0, -0.55, 0]} rotation={[0.32, 0, 0]}>
      <group ref={spin}>
        {/* Velvet cap, visible between the peaks like a real crown */}
        <mesh position={[0, 0.3, 0]} scale={[1, 0.85, 1]}>
          <sphereGeometry args={[0.5, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={velvet} attach="material" />
        </mesh>

        {/* Band, with a bead at the bottom and top */}
        <mesh geometry={band}>
          <primitive object={metal} attach="material" />
        </mesh>
        {[
          [0.012, 0.505, 0.03],
          [0.415, 0.563, 0.034],
        ].map(([y, r, tube]) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, tube, 20, 96]} />
            <primitive object={metal} attach="material" />
          </mesh>
        ))}

        {/* Gems set into the band */}
        {gems.map((mat, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 0.548, 0.2, Math.cos(a) * 0.548]}
              rotation={[0, a, 0]}
              scale={[1, 1.4, 0.55]}
            >
              <octahedronGeometry args={[0.07, 0]} />
              <primitive object={mat} attach="material" />
            </mesh>
          );
        })}

        {/* Ten peaks (five tall, five short), each leaning slightly outward, tipped with a pearl */}
        {peaks.map((p, i) => (
          <group
            key={i}
            position={[Math.sin(p.a) * 0.55, 0.41, Math.cos(p.a) * 0.55]}
            rotation={new THREE.Euler(0.14, p.a, 0, "YXZ")}
          >
            <mesh geometry={p.tall ? tall : short}>
              <primitive object={metal} attach="material" />
            </mesh>
            <mesh position={[0, (p.tall ? TALL : SHORT) + 0.03, 0]}>
              <sphereGeometry args={[p.tall ? 0.075 : 0.05, 32, 32]} />
              <primitive object={pearl} attach="material" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Fixed size box so the preloader can measure it and shrink it into the navbar dot.
export default function Crown3D() {
  return (
    <div className="h-28 w-28">
      <Canvas
        camera={{ position: [0, 0.35, 3.6], fov: 32 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />

        {/* A small procedural "photo studio": light panels the metal can reflect.
            Built in code, so nothing is downloaded. */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={4}
            position={[0, 5, 4]}
            scale={[10, 3, 1]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
          <Lightformer
            form="rect"
            intensity={2}
            position={[-5, 1, -1]}
            scale={[6, 6, 1]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
          <Lightformer
            form="ring"
            color="#d4ff66"
            intensity={3}
            position={[5, 2, 2]}
            scale={4}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
          <Lightformer
            form="rect"
            color="#7c5cff"
            intensity={1.5}
            position={[0, -3, 3]}
            scale={[8, 2, 1]}
            onUpdate={(self) => self.lookAt(0, 0, 0)}
          />
        </Environment>

        <Crown />
      </Canvas>
    </div>
  );
}