import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useStore } from '../store'

const SPACES: Record<string, { name: string; color: string; tagline: string; }> = {
  search:  { name: 'SEARCH',       color: '#4285F4', tagline: 'The web, reimagined.' },
  movies:  { name: 'M MOVIES',     color: '#EA4335', tagline: 'Cinematic universe.' },
  mall:    { name: 'M MALL',       color: '#FBBC05', tagline: 'Shop the stars.' },
  chart:   { name: 'M CHART',      color: '#34A853', tagline: 'Data at light speed.' },
  itserv:  { name: 'M ITSERVICE',  color: '#FF8C00', tagline: 'Tech that works.' },
  design:  { name: 'M DESIGN',     color: '#A855F7', tagline: 'Create the future.' },
  media:   { name: 'M MEDIA',      color: '#14B8A6', tagline: 'Stories in motion.' },
  portal:  { name: 'PORTAL',       color: '#0EA5E9', tagline: 'Your gateway.' },
}

export default function ServiceSpace() {
  const { selectedService, setView, reset } = useStore()
  const space = selectedService ? SPACES[selectedService] : null

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
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto"
          style={{
            background: `radial-gradient(circle at center, ${space.color}22 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.98) 100%)`,
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Back button */}
          <button
            onClick={back}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Universe
          </button>

          {/* Sparkles */}
          <Sparkles className="w-10 h-10 mb-6 animate-pulse" style={{ color: space.color }} />

          {/* Name */}
          <motion.h1
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
            className="text-6xl md:text-7xl font-black tracking-[0.15em] text-center"
            style={{ color: space.color, textShadow: `0 0 45px ${space.color}` }}
          >
            {space.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-white/60 text-sm md:text-base tracking-widest"
          >
            {space.tagline}
          </motion.p>

          {/* Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 text-white/30 text-xs tracking-widest"
          >
            ✦ SPACE LOADING — STAY TUNED ✦
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
