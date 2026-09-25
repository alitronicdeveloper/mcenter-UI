import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'

const SERVICES = [
  { id: 'search',  label: 'SEARCH',      color: '#4285F4', angle: 0 },
  { id: 'movies',  label: 'M MOVIES',    color: '#EA4335', angle: Math.PI * 0.22 },
  { id: 'mall',    label: 'M MALL',      color: '#FBBC05', angle: Math.PI * 0.44 },
  { id: 'sales',   label: 'M SALES',     color: '#34A853', angle: Math.PI * 0.66 },
  { id: 'chart',   label: 'M CHART',     color: '#0EA5E9', angle: Math.PI * 0.88 },
  { id: 'itserv',  label: 'M ITSERVICE', color: '#FF8C00', angle: Math.PI * 1.12 },
  { id: 'design',  label: 'M DESIGN',    color: '#A855F7', angle: Math.PI * 1.34 },
  { id: 'media',   label: 'M MEDIA',     color: '#14B8A6', angle: Math.PI * 1.56 },
  { id: 'portal',  label: 'PORTAL',      color: '#EC4899', angle: Math.PI * 1.78 },
]

const RADIUS = 2.4

export default function ServiceOrbit() {
  const groupRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState<string | null>(null)
  const { selectedService, setSelectedService, setView, loading } = useStore()
  const [visibleCount, setVisibleCount] = useState(0)

  // Wakati loading: services zinatokea moja baada ya nyingine
  // Baada ya loading: zote zinaonekana
  useEffect(() => {
    if (!loading) {
      setVisibleCount(SERVICES.length)
      return
    }

    // Reset na anza upya
    setVisibleCount(0)
    let count = 0
    const interval = setInterval(() => {
      count++
      setVisibleCount(count)
      if (count >= SERVICES.length) clearInterval(interval)
    }, 280)

    return () => clearInterval(interval)
  }, [loading])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)
    if (groupRef.current) groupRef.current.rotation.y += d * 0.08
  })

  const handleClick = (id: string) => {
    if (loading) return
    setSelectedService(id)
    setTimeout(() => setView('service'), 350)
  }

  return (
    <group ref={groupRef} rotation={[Math.PI * 0.12, 0, Math.PI * 0.04]}>
      {SERVICES.map((s, i) => {
        const visible = i < visibleCount
        const x = Math.cos(s.angle) * RADIUS
        const z = Math.sin(s.angle) * RADIUS
        const isHovered = hovered === s.id
        const isSelected = selectedService === s.id

        return (
          <ServiceNode
            key={s.id}
            s={s}
            x={x}
            z={z}
            visible={visible}
            isHovered={isHovered}
            isSelected={isSelected}
            onHover={() => setHovered(s.id)}
            onLeave={() => setHovered(null)}
            onClick={() => handleClick(s.id)}
          />
        )
      })}

      {/* Orbit path ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS - 0.008, RADIUS + 0.008, 160]} />
        <meshBasicMaterial color="#FFB060" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function ServiceNode({
  s, x, z, visible, isHovered, isSelected, onHover, onLeave, onClick,
}: {
  s: { id: string; label: string; color: string }
  x: number
  z: number
  visible: boolean
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const scaleRef = useRef(0)

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)
    const target = visible ? 1 : 0
    scaleRef.current += (target - scaleRef.current) * 12 * d
    if (groupRef.current) {
      groupRef.current.scale.setScalar(Math.max(0.001, scaleRef.current))
    }
  })

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Hit area kubwa */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onHover() }}
        onPointerOut={onLeave}
        onClick={(e) => { e.stopPropagation(); onClick() }}
        visible={false}
      >
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>

      {/* Core sphere */}
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

      {/* Halo ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26, 0.30, 64]} />
        <meshBasicMaterial
          color={s.color}
          transparent
          opacity={isHovered ? 0.95 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      {visible && (
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
      )}
    </group>
  )
}
