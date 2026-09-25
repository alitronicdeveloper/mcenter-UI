import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Trail } from '@react-three/drei'
import * as THREE from 'three'

const LETTERS = [
  { ch: 'M', color: '#4285F4' },
  { ch: 'C', color: '#EA4335' },
  { ch: 'E', color: '#FBBC05' },
  { ch: 'N', color: '#34A853' },
  { ch: 'T', color: '#4285F4' },
  { ch: 'E', color: '#EA4335' },
  { ch: 'R', color: '#FBBC05' },
]

const CYCLE_DURATION = 10   // sekunde 10 = mzunguko mmoja
const TRAVEL_TIME = 6       // sekunde 6 kusafiri (speed moja)

export default function Comet3D() {
  const groupRef = useRef<THREE.Group>(null!)
  const headRef = useRef<THREE.Mesh>(null!)

  // Path — juu-kulia → NYUMA ya dunia → chini-kushoto
  const curve = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(11, 2.8, 3.5),     // anza juu kulia, mbele
        new THREE.Vector3(0, 0, -7),         // katikati NYUMA ya dunia
        new THREE.Vector3(-11, -2.8, 3.5)    // mwisho chini kushoto, mbele
      ),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const cycleT = t % CYCLE_DURATION

    const visible = cycleT < TRAVEL_TIME
    // LINEAR speed — hakuna ease, hakuna vituo
    const p = visible ? cycleT / TRAVEL_TIME : 0

    if (groupRef.current) {
      groupRef.current.visible = visible
      if (visible) {
        const point = curve.getPoint(p)
        groupRef.current.position.copy(point)
      }
    }

    // Pulse ndogo ya kichwa
    if (headRef.current && visible) {
      const pulse = 1 + Math.sin(t * 20) * 0.15
      headRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Point light kubwa inayofuata comet */}
      <pointLight color="#4285F4" intensity={4} distance={15} />
      <pointLight color="#34A853" intensity={2} distance={10} />

      {/* ============ MKIA 1 — WIDE, BLURRED, MKUBWA SANA ============ */}
      {/* Hii ni mkia unaofuata — mesh kubwa yenye gradient */}
      <Trail
        width={3.5}
        length={12}
        color={'#4285F4'}
        attenuation={(w) => w}
      >
        <mesh ref={headRef}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>

      {/* ============ MKIA 2 — KATI, BLUU MKALI ============ */}
      <Trail
        width={1.8}
        length={10}
        color={'#4285F4'}
        attenuation={(w) => w * w}
      >
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#a8c8ff" />
        </mesh>
      </Trail>

      {/* ============ MKIA 3 — MWEMBAMBA CORE NYEUPE ============ */}
      <Trail
        width={0.6}
        length={8}
        color={'#ffffff'}
        attenuation={(w) => w * w * w}
      >
        <mesh>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Trail>

      {/* ============ GLOW LAYERS ZA KICHWA ============ */}
      {/* Glow 1 — nyeupe kali */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* Glow 2 — bluu kubwa */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color="#4285F4" transparent opacity={0.5} />
      </mesh>

      {/* Glow 3 — kijani */}
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#34A853" transparent opacity={0.2} />
      </mesh>

      {/* Glow 4 — yellow halo nyepesi sana */}
      <mesh>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial color="#FBBC05" transparent opacity={0.08} />
      </mesh>

      {/* ============ MCENTER TEXT — kichwa cha comet ============ */}
      <Html center occlude style={{ pointerEvents: 'none' }}>
        <div
          className="flex items-center"
          style={{ filter: 'drop-shadow(0 0 35px rgba(255,255,255,0.95))' }}
        >
          {LETTERS.map((l, i) => (
            <span
              key={i}
              style={{
                color: l.color,
                fontSize: 'clamp(30px, 4.5vw, 48px)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                textShadow: `
                  0 0 12px #ffffff,
                  0 0 25px ${l.color},
                  0 0 50px ${l.color},
                  0 0 100px ${l.color}cc,
                  0 0 160px ${l.color}88
                `,
              }}
            >
              {l.ch}
            </span>
          ))}
        </div>
      </Html>
    </group>
  )
}
