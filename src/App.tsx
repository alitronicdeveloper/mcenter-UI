import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Universe from './components/Universe'
import Earth from './components/Earth'
import ServiceOrbit from './components/ServiceOrbit'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import RecentSearches from './components/RecentSearches'
import TrendingColumns from './components/TrendingColumns'
import ServiceSpace from './components/ServiceSpace'
import TrendView from './components/TrendView'
import LoadingScreen from './components/LoadingScreen'
import TopRightProfile from './components/TopRightProfile'
import { useStore } from './store'

export default function App() {
  const view = useStore((s) => s.view)
  const isUniverse = view === 'universe'

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: '#000005' }}>

      {/* Brand juu kushoto */}
      <div
        className={`fixed top-4 md:top-6 left-4 md:left-6 z-30 flex items-center gap-3 pointer-events-none transition-opacity duration-500 ${
          isUniverse ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center font-black text-white shadow-[0_0_25px_rgba(66,133,244,0.5)]">
          M
        </div>
        <div>
          <h1 className="text-xs md:text-sm font-black tracking-widest">
            <span className="text-[#4285F4]">M</span>
            <span className="text-[#EA4335]">C</span>
            <span className="text-[#FBBC05]">E</span>
            <span className="text-[#34A853]">N</span>
            <span className="text-[#4285F4]">T</span>
            <span className="text-[#EA4335]">E</span>
            <span className="text-[#FBBC05]">R</span>
          </h1>
          <p className="text-white/40 text-[9px] md:text-[10px]">Search the web. Explore the center.</p>
        </div>
      </div>

      {/* Canvas — z-0 (nyuma ya kila kitu) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${
          isUniverse ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Canvas
          camera={{ position: [0, 1.2, 6], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false }}
          dpr={[1, 1.5]}
          onCreated={({ gl }) => gl.setClearColor('#000005')}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <pointLight position={[-10, -8, -10]} intensity={0.6} color="#4a90e2" />
          <pointLight position={[0, -5, 3]} intensity={0.3} color="#FF8C00" />

          <Universe />
          <Earth />
          <ServiceOrbit />

          <OrbitControls
            enablePan={false}
            enableZoom={isUniverse}
            enabled={isUniverse}
            minDistance={3.5}
            maxDistance={10}
            rotateSpeed={0.6}
            zoomSpeed={0.8}
            enableDamping
            dampingFactor={0.05}
            touches={{ ONE: 1, TWO: 2 }}
            /* Kushoto/kulia ±45° */
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            /* Juu/chini — ruhusu zaidi juu sasa */
            minPolarAngle={Math.PI / 2 - Math.PI / 3}   /* inaruhusu kuangalia juu zaidi */
            maxPolarAngle={Math.PI / 2 + Math.PI / 8}
          />

          <EffectComposer multisampling={0}>
            <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Profile juu kulia — z-30 juu ya kila kitu */}
      <TopRightProfile />

      {/* Search bar — z-30 */}
      {isUniverse && <SearchBar />}

      {/* Trends — z-20 juu ya canvas */}
      {isUniverse && <TrendingColumns />}

      {/* Recent — z-20 chini */}
      {isUniverse && <RecentSearches />}

      {/* Search results — z-20 */}
      {isUniverse && <SearchResults />}

      {/* Full screen — z-40 juu ya kila kitu */}
      <ServiceSpace />
      <TrendView />

      <LoadingScreen />
    </div>
  )
}
