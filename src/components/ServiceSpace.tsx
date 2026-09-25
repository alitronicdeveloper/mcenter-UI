import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useStore } from '../store'
import MoviesSpace from '../spaces/MoviesSpace'
import MallSpace from '../spaces/MallSpace'
import SalesSpace from '../spaces/SalesSpace'
import ITServiceSpace from '../spaces/ITServiceSpace'
import DesignSpace from '../spaces/DesignSpace'
import PortalSpace from '../spaces/PortalSpace'

const SPACES: Record<string, { name: string; color: string; component?: React.FC }> = {
  search:  { name: 'SEARCH',       color: '#4285F4' },
  movies:  { name: 'M MOVIES',     color: '#EA4335', component: MoviesSpace },
  mall:    { name: 'M MALL',       color: '#FBBC05', component: MallSpace },
  sales:   { name: 'M SALES',      color: '#34A853', component: SalesSpace },
  chart:   { name: 'M CHART',      color: '#0EA5E9' },
  itserv:  { name: 'M ITSERVICE',  color: '#FF8C00', component: ITServiceSpace },
  design:  { name: 'M DESIGN',     color: '#A855F7', component: DesignSpace },
  media:   { name: 'M MEDIA',      color: '#14B8A6' },
  portal:  { name: 'PORTAL',       color: '#EC4899', component: PortalSpace },
}

export default function ServiceSpace() {
  const { selectedService, setView, reset } = useStore()
  const space = selectedService ? SPACES[selectedService] : null
  const Component = space?.component

  const back = () => {
    setView('universe')
    setTimeout(() => reset(), 300)
  }

  return (
    <AnimatePresence>
      {space && (
        <motion.div
          key={space.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 flex flex-col overflow-hidden"
          style={{ background: `linear-gradient(180deg, #0a0e1a 0%, #050810 40%, #000005 100%)` }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% -10%, ${space.color}25 0%, transparent 55%)` }} />

          <div className="relative flex items-center justify-between px-3 md:px-8 py-4 md:py-5 border-b border-white/10 backdrop-blur-sm shrink-0">
            <button onClick={back}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-[11px] md:text-sm">
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: space.color }} />
              <span className="text-[10px] md:text-xs tracking-widest text-white/50">
                {space.name} SPACE
              </span>
            </div>
          </div>

          <div className="relative flex-1 overflow-y-auto px-3 md:px-8 py-5 md:py-10 scroll-thin">
            {Component ? <Component /> : <Placeholder name={space.name} color={space.color} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Placeholder({ name, color }: { name: string; color: string }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-16 md:py-24">
      <Sparkles className="w-12 h-12 md:w-16 md:h-16 mb-6 animate-pulse" style={{ color }} />
      <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-3"
        style={{ color, textShadow: `0 0 45px ${color}` }}>
        {name}
      </h1>
      <p className="text-white/50 text-sm md:text-base tracking-widest">✦ SPACE LOADING — STAY TUNED ✦</p>
    </div>
  )
}
