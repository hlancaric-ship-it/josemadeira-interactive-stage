import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioStore } from '../store/audioStore';

const dummy = new THREE.Object3D();
const RED = new THREE.Color('#C81E2C');
const GOLD = new THREE.Color('#C9A227');
const tmpColor = new THREE.Color();

interface Ember {
  x: number;
  z: number;
  y: number;
  speed: number;
  drift: number;
  phase: number;
  scale: number;
  gold: number;
}

const Embers = ({ count }: { count: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const colorAttrRef = useRef<THREE.InstancedBufferAttribute>(null);
  const colorArray = useMemo(() => new Float32Array(count * 3), [count]);

  useEffect(() => {
    meshRef.current?.geometry.setAttribute(
      'color',
      new THREE.InstancedBufferAttribute(colorArray, 3)
    );
    colorAttrRef.current = meshRef.current?.geometry.getAttribute('color') as THREE.InstancedBufferAttribute;
  }, [colorArray]);

  const embers = useMemo<Ember[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 10 - 3,
        y: Math.random() * 14 - 7,
        speed: 0.22 + Math.random() * 0.5,
        drift: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 1,
        gold: Math.random() < 0.18 ? 1 : 0,
      })),
    [count]
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const { frequency, isPlaying } = useAudioStore.getState();
    const kick = isPlaying ? frequency : 0.12;

    embers.forEach((e, i) => {
      const y = ((e.y + t * e.speed * (0.6 + kick * 0.8)) % 14) - 7;
      const x = e.x + Math.sin(t * 0.3 + e.phase) * e.drift;
      dummy.position.set(x, y, e.z);
      const pulse = 1 + kick * 1.4 * (0.5 + 0.5 * Math.sin(t * 3 + e.phase));
      const s = e.scale * (0.028 + 0.018 * Math.sin(t * 2 + e.phase)) * pulse;
      dummy.scale.setScalar(Math.max(0.012, s));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      tmpColor.copy(e.gold ? GOLD : RED);
      tmpColor.multiplyScalar(0.75 + kick * 0.5);
      colorArray[i * 3] = tmpColor.r;
      colorArray[i * 3 + 1] = tmpColor.g;
      colorArray[i * 3 + 2] = tmpColor.b;
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (colorAttrRef.current) colorAttrRef.current.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors transparent opacity={0.6} />
    </instancedMesh>
  );
};

/** Twin energy rings — a distant echo of the CDJ jog wheel, pulsing with the beat. */
const EnergyRings = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    const { frequency, isPlaying } = useAudioStore.getState();
    const kick = isPlaying ? frequency : 0.1;

    if (ring1.current) {
      ring1.current.rotation.z += delta * 0.06;
      const s = 3.1 + kick * 0.35;
      ring1.current.scale.setScalar(s);
      (ring1.current.material as THREE.MeshBasicMaterial).opacity = 0.14 + kick * 0.22;
    }
    if (ring2.current) {
      ring2.current.rotation.z -= delta * 0.045;
      const s = 3.7 + kick * 0.5;
      ring2.current.scale.setScalar(s);
      (ring2.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + kick * 0.16;
    }
  });

  return (
    <group position={[2.4, 0.2, -5]} rotation={[0.5, 0.3, 0]}>
      <mesh ref={ring1}>
        <torusGeometry args={[1, 0.008, 16, 120]} />
        <meshBasicMaterial color="#C81E2C" transparent opacity={0.18} />
      </mesh>
      <mesh ref={ring2} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[1, 0.006, 16, 120]} />
        <meshBasicMaterial color="#C9A227" transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export const EmberField = () => {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return null;

  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isSmall ? 30 : 70;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas
        dpr={[1, isSmall ? 1.5 : 2]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Embers count={count} />
        <EnergyRings />
      </Canvas>
    </div>
  );
};
