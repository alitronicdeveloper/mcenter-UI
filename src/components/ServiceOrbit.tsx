import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'

const SERVICES = [
  { id: 'search',  label: 'SEARCH',      color: '#4285F4', angle: 0 },
  { id: 'movies',  label: 'M MOVIES',    color: '#EA4335', angle: Math.PI * 0.25 },
  { id: 'mall',    label: 'M MALL',      color: '#FBBC05', angle: Math.PI * 0.5 },
  { id: 'chart',   label: 'M CHART',     color: '#34A853', angle: Math.PI * 0.75 },
  { id: 'itserv',  label: 'M ITSERVICE', color: '#FF8C00', angle: Math.PI },
  { id: 'design',  label: 'M DESIGN',    color: '#A855F7', angle: Math.PI * 1.25 },
  { id: 'media',   label: 'M MEDIA',     color: '#14B8A6', angle: Math.PI * 1.5 },
  { id: 'portal',  label: 'PORTAL',      color: '#0EA5E9', angle: Math.PI * 1.75 },
]

const RADIUS = 2.4

export default function ServiceOrbit() {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState<string | null>(null)
  const { selectedService, setSelectedService, setView } = useStore()

  // ❌ HAKUNA auto-rotation — services zinasimama mpaka user azungushe camera

  const handleClick = (id: string) => {
    setSelectedService(id)
    setTimeout(() => setView('service'), 350)
  }

  return (
    <group ref={groupRef} rotation={[Math.PI * 0.12, 0, Math.PI * 0.04]}>
      {SERVICES.map((s) => {
        const x = Math.cos(s.angle) * RADIUS
        const z = Math.sin(s.angle) * RADIUS
        const isHovered = hovered === s.id
        const isSelected = selectedService === s.id

        return (
          <group key={s.id} position={[x, 0, z]}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); setHovered(s.id) }}
              onPointerOut={() => setHovered(null)}
              onClick={(e) => { e.stopPropagation(); handleClick(s.id) }}
              visible={false}
            >
              <sphereGeometry args={[0.4, 16, 16]} />
            </mesh>

            <mesh>
              <sphereGeometry args={[isHovered ? 0.23 : 0.18, 32, 32]} />
              <meshStandardMaterial
                color={s.color}
                emissive={s.color}
                emissiveIntensity={isHovered || isSelected ? 1.8 : 0.7}
                transparent
                opacity={0.92}
              />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26, 0.30, 64]} />
              <meshBasicMaterial
                color={s.color}
                transparent
                opacity={isHovered ? 0.95 : 0.35}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Html center distanceFactor={7} position={[0, -0.5, 0]}>
              <div
                style={{
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${s.color}80`,
                  boxShadow: isHovered ? `0 0 22px ${s.color}` : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  pointerEvents: 'none',
                }}
              >
                {s.label}
              </div>
            </Html>
          </group>
        )
      })}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS - 0.008, RADIUS + 0.008, 160]} />
        <meshBasicMaterial color="#FFB060" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
