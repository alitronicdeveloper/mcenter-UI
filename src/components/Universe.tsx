import { Stars, Sparkles } from '@react-three/drei'

export default function Universe() {
  return (
    <>
      <Stars radius={100} depth={60} count={8000} factor={5} saturation={0} fade speed={0.4} />
      <Sparkles count={220} scale={22} size={2} speed={0.3} color="#a8c8ff" opacity={0.6} />
      <Sparkles count={120} scale={16} size={4} speed={0.2} color="#ffb060" opacity={0.45} />
      <Sparkles count={60}  scale={30} size={6} speed={0.15} color="#ff5a8a" opacity={0.35} />
    </>
  )
}
