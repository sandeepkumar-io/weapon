'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const PERIOD = 9; // seconds per full jet cycle (incl. off-screen gap)
const FLIGHT = 0.62; // fraction of the cycle the jet is crossing the screen
const FLARE_COUNT = 7;
const TURRET = { x: -1.8, y: -2.6, z: 0.5 };
const FWD = new THREE.Vector3(1, 0, 0);

/** Shared jet position so the turret + missile can target where the jet is. */
function jetPos(t: number): [number, number] {
  const cycle = (t % PERIOD) / PERIOD;
  const x = cycle < FLIGHT ? -10 + (cycle / FLIGHT) * 20 : 14;
  const y = Math.sin(t * 1.5) * 0.35 + 0.4;
  return [x, y];
}

const steel = { color: '#9aa6b5', metalness: 0.85, roughness: 0.35 } as const;
const dark = { color: '#2b2f37', metalness: 0.7, roughness: 0.5 } as const;

/** Low-poly but real 3D fighter jet, nose pointing +X (its travel direction). */
function Jet() {
  const group = useRef<THREE.Group>(null!);
  const burn = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const [x, y] = jetPos(t);
    group.current.position.x = x;
    group.current.position.y = y;
    group.current.rotation.z = Math.sin(t * 1.1) * 0.14 - 0.06;
    group.current.rotation.x = Math.sin(t * 0.8) * 0.06;
    group.current.rotation.y = -0.12;
    if (burn.current) {
      const m = burn.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.6 + Math.sin(t * 40) * 0.25;
    }
  });

  return (
    <group ref={group} scale={0.95} rotation={[0, -0.12, 0]}>
      <mesh scale={[1.5, 0.3, 0.3]}>
        <sphereGeometry args={[1, 28, 18]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[1.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.8, 24]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0.7, 0.22, 0]} scale={[0.55, 0.28, 0.26]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshStandardMaterial color="#0b3a7a" metalness={0.3} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      <mesh position={[-0.15, -0.02, 0.95]} rotation={[0, -0.55, 0.04]}>
        <boxGeometry args={[1.5, 0.05, 1.9]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-0.15, -0.02, -0.95]} rotation={[0, 0.55, -0.04]}>
        <boxGeometry args={[1.5, 0.05, 1.9]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-1.2, 0, 0.5]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.8]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-1.2, 0, -0.5]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.8]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-1.25, 0.35, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.6, 0.7, 0.05]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[-1.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.26, 0.4, 20]} />
        <meshStandardMaterial color="#3a3f4a" metalness={0.9} roughness={0.5} />
      </mesh>
      <mesh ref={burn} position={[-2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 1.0, 18]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.7} />
      </mesh>
      <pointLight position={[-2.1, 0, 0]} intensity={3} distance={4} color="#38bdf8" />
    </group>
  );
}

/**
 * Combat choreography:
 *  turret aims & fires a missile -> missile homes on the jet ->
 *  jet ejects flares -> missile is decoyed onto a flare -> detonates (jet survives).
 */
function Combat() {
  const barrel = useRef<THREE.Group>(null!);
  const missile = useRef<THREE.Group>(null!);
  const flash = useRef<THREE.Mesh>(null!);
  const flareRefs = useRef<(THREE.Mesh | null)[]>([]);

  const d = useRef({
    period: -1,
    phase: 'idle' as 'idle' | 'homing' | 'decoyed' | 'done',
    chosen: 0,
    flares: Array.from({ length: FLARE_COUNT }, () => ({
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      life: 0,
    })),
  });

  const deployFlares = (jx: number, jy: number) => {
    for (let i = 0; i < FLARE_COUNT; i++) {
      const f = d.current.flares[i];
      f.pos.set(jx - 0.4 + (Math.random() - 0.5) * 0.4, jy + (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.6);
      f.vel.set(-1.4 - Math.random() * 1.2, -0.6 - Math.random() * 1.2, (Math.random() - 0.5) * 1.4);
      f.life = 1;
    }
  };

  const detonate = (at: THREE.Vector3) => {
    d.current.phase = 'done';
    missile.current.visible = false;
    flash.current.position.copy(at);
    flash.current.visible = true;
    flash.current.scale.setScalar(0.25);
    (flash.current.material as THREE.MeshBasicMaterial).opacity = 1;
  };

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const period = Math.floor(t / PERIOD);
    const cycle = (t % PERIOD) / PERIOD;
    const st = d.current;
    const [jx, jy] = jetPos(t);

    // turret tracks the jet
    barrel.current.rotation.z = Math.atan2(jy - TURRET.y, jx - TURRET.x);

    if (period !== st.period) {
      st.period = period;
      st.phase = 'idle';
      missile.current.visible = false;
      flash.current.visible = false;
      st.flares.forEach((f) => (f.life = 0));
    }

    // Fire once the jet is on screen.
    if (st.phase === 'idle' && cycle > 0.2 && cycle < 0.48) {
      const ang = barrel.current.rotation.z;
      missile.current.position.set(TURRET.x + Math.cos(ang) * 1.4, TURRET.y + Math.sin(ang) * 1.4, TURRET.z);
      missile.current.visible = true;
      st.phase = 'homing';
    }

    // Advance + fade flares every frame.
    for (let i = 0; i < FLARE_COUNT; i++) {
      const f = st.flares[i];
      const mesh = flareRefs.current[i];
      if (!mesh) continue;
      if (f.life > 0) {
        f.life -= delta / 1.7;
        f.vel.y -= 2.4 * delta; // gravity
        f.pos.addScaledVector(f.vel, delta);
        mesh.visible = f.life > 0;
        mesh.position.copy(f.pos);
        mesh.scale.setScalar(Math.max(0.001, 0.13 * f.life + 0.04));
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, f.life);
      } else {
        mesh.visible = false;
      }
    }

    const pos = missile.current.position;

    if (st.phase === 'homing') {
      const dir = new THREE.Vector3(jx, jy, 0).sub(pos);
      const dist = dir.length();
      if (dist < 2.8) {
        // Jet pops flares; missile gets seduced by a flare instead of the jet.
        deployFlares(jx, jy);
        st.chosen = 0;
        st.phase = 'decoyed';
      } else {
        dir.normalize();
        pos.addScaledVector(dir, Math.min(dist, 8.5 * delta));
        missile.current.quaternion.setFromUnitVectors(FWD, dir);
      }
    } else if (st.phase === 'decoyed') {
      const f = st.flares[st.chosen];
      if (f.life <= 0) {
        detonate(pos); // flare burnt out -> missile self-destructs
      } else {
        const dir = f.pos.clone().sub(pos);
        const dist = dir.length();
        if (dist < 0.45) {
          detonate(f.pos);
        } else {
          dir.normalize();
          pos.addScaledVector(dir, Math.min(dist, 7 * delta));
          missile.current.quaternion.setFromUnitVectors(FWD, dir);
        }
      }
    }

    // Jet escaped off-screen before resolution.
    if ((st.phase === 'homing' || st.phase === 'decoyed') && cycle > FLIGHT) {
      st.phase = 'done';
      missile.current.visible = false;
    }

    // Detonation flash expand + fade.
    if (flash.current.visible) {
      const m = flash.current.material as THREE.MeshBasicMaterial;
      m.opacity *= 0.9;
      flash.current.scale.multiplyScalar(1.09);
      if (m.opacity < 0.05) flash.current.visible = false;
    }
  });

  return (
    <group>
      {/* ---- Ground anti-air launcher ---- */}
      <group position={[TURRET.x, TURRET.y, TURRET.z]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 0.4, 20]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.8]} />
          <meshStandardMaterial color="#3b4150" metalness={0.6} roughness={0.5} />
        </mesh>
        {/* rotating barrel that tracks the jet */}
        <group ref={barrel}>
          <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.12, 1.3, 14]} />
            <meshStandardMaterial color="#6b7280" metalness={0.85} roughness={0.4} />
          </mesh>
          <mesh position={[1.3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.12, 0.25, 14]} />
            <meshStandardMaterial {...dark} />
          </mesh>
        </group>
      </group>

      {/* ---- Missile (forward = +X) ---- */}
      <group ref={missile} visible={false}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0.32, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.05, 0.18, 12]} />
          <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[-0.24, 0.07, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.02]} />
          <meshStandardMaterial color="#9aa6b5" />
        </mesh>
        <mesh position={[-0.24, 0, 0.07]}>
          <boxGeometry args={[0.12, 0.02, 0.1]} />
          <meshStandardMaterial color="#9aa6b5" />
        </mesh>
        <mesh position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.07, 0.3, 12]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.95} />
        </mesh>
        <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.12, 1.6, 12]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0.25} />
        </mesh>
        <pointLight position={[-0.5, 0, 0]} intensity={2} distance={2.5} color="#fb923c" />
      </group>

      {/* ---- Flare pool ---- */}
      {Array.from({ length: FLARE_COUNT }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            flareRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#fff3b0" transparent opacity={1} />
        </mesh>
      ))}

      {/* flare glow lights for the first couple (cheap) */}

      {/* ---- Detonation flash ---- */}
      <mesh ref={flash} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={1} />
      </mesh>
    </group>
  );
}

export default function FlyingJet3D() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false, powerPreference: 'default' }}
      camera={{ position: [0, 0.6, 7], fov: 45 }}
      dpr={[1, 2]}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -2, -3]} intensity={1} color="#60a5fa" />
      <Jet />
      <Combat />
    </Canvas>
  );
}
