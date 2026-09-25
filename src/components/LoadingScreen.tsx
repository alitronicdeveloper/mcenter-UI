import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useStore } from '../store'

export default function LoadingScreen() {
  const { loading, setLoading } = useStore()

  useEffect(() => {
    if (!loading) return
    const endTimer = setTimeout(() => setLoading(false), 4200)
    return () => clearTimeout(endTimer)
  }, [loading, setLoading])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, rgba(0,0,5,0.02) 0%, rgba(0,0,5,0.2) 50%, rgba(0,0,5,0.65) 100%)',
          }}
        />
      )}
    </AnimatePresence>
  )
}
