import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  const { view, selectedTrend, selectedService } = useStore()
  const texture = useTexture('/textures/earth-blue-marble.jpg')

  // Rangi ya glow kulingana na trend au service
  const glowColor = (() => {
    if (view === 'trend' && selectedTrend) {
      return selectedTrend.region === 'tz' ? '#34A853' : '#4285F4'
    }
    if (view === 'service' && selectedService) {
      // Rangi ya service (kutoka ServiceOrbit)
      const SERVICE_COLORS: Record<string, string> = {
        search: '#4285F4', movies: '#EA4335', mall: '#FBBC05', chart: '#34A853',
        itserv: '#FF8C00', design: '#A855F7', media: '#14B8A6', portal: '#0EA5E9',
      }
      return SERVICE_COLORS[selectedService] || '#5aa9ff'
    }
    return '#5aa9ff'
  })()

  // Nguvu ya glow
  const glowOpacity = view === 'universe' ? 0.14 : 0.45

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)
    if (earthRef.current) earthRef.current.rotation.y += d * 0.05

    if (groupRef.current) {
      const target = view === 'service' || view === 'trend' ? 1.6 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer glow — rangi inabadilika */}
      <mesh scale={1.25}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity * 0.5} side={THREE.BackSide} />
      </mesh>

      <mesh scale={1.18}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity * 0.7} side={THREE.BackSide} />
      </mesh>

      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Atmosphere rim — rangi inabadilika */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}
