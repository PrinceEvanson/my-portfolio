import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easeInOutExpo } from "@/lib/motion";

// Requires: npm i three @react-three/fiber @react-three/drei
// (drei is optional here, only needed if you add <Environment />)

// A real 3D glossy crown: band, rims, five peaks and jewel tips.
function Crown() {
  const group = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 1.6; // spin speed
  });

  const material = (
    <meshPhysicalMaterial
      color="#c6ff3d"
      metalness={0.55}
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.1}
    />
  );

  // Five peak positions around the ring
  const peaks = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2;
    return [Math.sin(a) * 0.54, Math.cos(a) * 0.54];
  });

  return (
    <group ref={group} rotation={[0.25, 0, 0]} position={[0, -0.4, 0]}>
      {/* Band */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.56, 0.5, 0.4, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#c6ff3d"
          metalness={0.55}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom and top rims */}
      {[0, 0.4].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[y ? 0.56 : 0.5, 0.045, 24, 64]} />
          {material}
        </mesh>
      ))}

      {/* Peaks with jewel tips */}
      {peaks.map(([x, z], i) => (
        <group key={i} position={[x, 0.4, z]}>
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.14, 0.56, 24]} />
            {material}
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.09, 32, 32]} />
            {material}
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Crown3D() {
  return (
    <div className="h-28 w-28">
      <Canvas
        camera={{ position: [0, 0.4, 3.4], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <directionalLight position={[-4, 1, -3]} intensity={1} color="#d4ff66" />
        <pointLight position={[0, -2, 2]} intensity={0.8} />
        <Crown />
      </Canvas>
    </div>
  );
}

// Displays a 3D spinning glossy crown and "Prince", then slides up to reveal the page.
export default function Preloader({ onDone }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (complete) {
      const t = setTimeout(onDone, 800);
      return () => clearTimeout(t);
    }
  }, [complete, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: easeInOutExpo } }}
    >
      {/* Hovering bounce container */}
      <motion.div
        className="relative mb-6 flex flex-col items-center"
        animate={{ y: [-6, 6, -6] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Real 3D spinning crown */}
        <Crown3D />

        {/* Soft Contact Floor Shadow */}
        <motion.div
          className="mt-3 h-2 w-12 rounded-full bg-accent/30 blur-sm"
          animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        className="text-4xl font-bold tracking-tight md:text-6xl text-paper"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Prince
      </motion.h1>

      <motion.p
        className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        welcome to my portfolio
      </motion.p>
    </motion.div>
  );
}