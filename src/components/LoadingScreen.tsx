import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useStore } from '../store'

export default function LoadingScreen() {
  const { loading, setLoading } = useStore()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 400)
          return 100
        }
        return p + 4
      })
    }, 60)
    return () => clearInterval(interval)
  }, [setLoading])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#000005' }}
        >
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05] flex items-center justify-center font-black text-3xl text-white shadow-[0_0_60px_rgba(66,133,244,0.6)]">
              M
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black tracking-[0.3em] mb-2"
          >
            <span className="text-[#4285F4]">M</span>
            <span className="text-[#EA4335]">C</span>
            <span className="text-[#FBBC05]">E</span>
            <span className="text-[#34A853]">N</span>
            <span className="text-[#4285F4]">T</span>
            <span className="text-[#EA4335]">E</span>
            <span className="text-[#FBBC05]">R</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/40 text-xs tracking-widest mb-8"
          >
            SEARCH THE WEB. EXPLORE THE CENTER.
          </motion.p>

          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <div className="mt-3 text-[10px] text-white/30 tracking-widest">
            {progress < 100 ? `INITIALIZING UNIVERSE... ${progress}%` : 'READY'}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
