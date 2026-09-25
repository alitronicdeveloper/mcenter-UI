import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Universe from './components/Universe'
import Earth from './components/Earth'
import ServiceOrbit from './components/ServiceOrbit'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import TrendingColumns from './components/TrendingColumns'
import ServiceSpace from './components/ServiceSpace'
import TrendView from './components/TrendView'
import LoadingScreen from './components/LoadingScreen'
import TopRightProfile from './components/TopRightProfile'
import Comet3D from './components/Comet3D'
import ChatPanel from './spaces/mall/ChatPanel'
import { useStore } from './store'

export default function App() {
  const view = useStore((s) => s.view)
  const isUniverse = view === 'universe'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const earthHeight = isMobile ? '48vh' : '58vh'

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#000005' }}>

      {/* Brand juu kushoto */}
      <div
        className={`fixed top-2 md:top-6 left-3 md:left-6 z-30 flex items-center gap-2 md:gap-3 pointer-events-none transition-opacity duration-500 ${
          isUniverse ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center font-black text-white text-xs md:text-base shadow-[0_0_25px_rgba(66,133,244,0.5)]">
          M
        </div>
        <div className="hidden xs:block">
          <h1 className="text-[10px] md:text-sm font-black tracking-widest leading-tight">
            <span className="text-[#4285F4]">M</span>
            <span className="text-[#EA4335]">C</span>
            <span className="text-[#FBBC05]">E</span>
            <span className="text-[#34A853]">N</span>
            <span className="text-[#4285F4]">T</span>
            <span className="text-[#EA4335]">E</span>
            <span className="text-[#FBBC05]">R</span>
          </h1>
          <p className="text-white/40 text-[8px] md:text-[10px] hidden md:block">Search the web. Explore the center.</p>
        </div>
      </div>

      <TopRightProfile />

      {/* Canvas */}
      <div
        className={`absolute top-0 left-0 right-0 z-0 transition-opacity duration-500 ${
          isUniverse ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ height: earthHeight }}
      >
        <Canvas
          camera={{ position: [0, 0.5, isMobile ? 6.5 : 5.5], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          onCreated={({ gl }) => gl.setClearColor('#000005')}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -8, -10]} intensity={0.6} color="#4a90e2" />
          <pointLight position={[0, -5, 3]} intensity={0.3} color="#FF8C00" />

          <Universe />
          <Earth />
          <ServiceOrbit />
          <Comet3D />

          <OrbitControls
            enablePan={false}
            enableZoom={isUniverse}
            enabled={isUniverse}
            minDistance={3.5}
            maxDistance={isMobile ? 8 : 9}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            enableDamping
            dampingFactor={0.05}
            touches={{ ONE: 1, TWO: 2 }}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            minPolarAngle={Math.PI / 2 - Math.PI / 3}
            maxPolarAngle={Math.PI / 2 + Math.PI / 8}
          />

          <EffectComposer multisampling={0}>
            <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Horizontal line */}
      {isUniverse && (
        <div
          className="fixed left-0 right-0 z-10 pointer-events-none transition-all duration-500"
          style={{
            top: earthHeight,
            height: '1px',
            background:
              'linear-gradient(to right, transparent 8%, #34A853 25%, #FBBC05 42%, #EA4335 58%, #4285F4 75%, transparent 92%)',
            boxShadow: '0 0 20px rgba(66,133,244,0.3)',
          }}
        />
      )}

      {isUniverse && <SearchBar />}
      {isUniverse && <TrendingColumns topOffset={earthHeight} />}
      {isUniverse && <SearchResults />}

      <ServiceSpace />
      <TrendView />
      <LoadingScreen />

      {/* ChatPanel — global, iko juu ya kila kitu */}
      <ChatPanel />
    </div>
  )
}
