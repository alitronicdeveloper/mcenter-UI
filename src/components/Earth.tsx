import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  // Spin speed ya kuanzia — kubwa sana (intro)
  const spinSpeedRef = useRef(3.5)

  const { view, selectedTrend, selectedService, loading } = useStore()
  const texture = useTexture('/textures/earth-blue-marble.jpg')

  // Rangi ya glow kulingana na hali
  const glowColor = useMemo(() => {
    if (view === 'trend' && selectedTrend) {
      return selectedTrend.region === 'tz' ? '#34A853' : '#4285F4'
    }
    if (view === 'service' && selectedService) {
      const SERVICE_COLORS: Record<string, string> = {
        search: '#4285F4', movies: '#EA4335', mall: '#FBBC05', sales: '#34A853',
        chart: '#0EA5E9', itserv: '#FF8C00', design: '#A855F7', media: '#14B8A6', portal: '#EC4899',
      }
      return SERVICE_COLORS[selectedService] || '#5aa9ff'
    }
    return '#5aa9ff'
  }, [view, selectedTrend, selectedService])

  const glowOpacity = view === 'universe' ? 0.14 : 0.45

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)

    // Target speed: kubwa sana wakati loading, kawaida baada ya hapo
    const targetSpeed = loading ? 3.5 : 0.05

    // Smooth lerp — inapunguza taratibu
    spinSpeedRef.current += (targetSpeed - spinSpeedRef.current) * 0.025

    if (earthRef.current) {
      earthRef.current.rotation.y += d * spinSpeedRef.current
    }

    // Scale transition kwa view (service/trend inakuza Earth)
    if (groupRef.current) {
      const target = view === 'service' || view === 'trend' ? 1.6 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Outer glow 1 */}
      <mesh scale={1.25}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity * 0.5} side={THREE.BackSide} />
      </mesh>

      {/* Outer glow 2 */}
      <mesh scale={1.18}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity * 0.7} side={THREE.BackSide} />
      </mesh>

      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Atmosphere rim */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={glowColor} transparent opacity={glowOpacity} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}
