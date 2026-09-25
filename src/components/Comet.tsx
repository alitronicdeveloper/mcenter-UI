import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LETTERS = [
  { ch: 'M', color: '#4285F4' },
  { ch: 'C', color: '#EA4335' },
  { ch: 'E', color: '#FBBC05' },
  { ch: 'N', color: '#34A853' },
  { ch: 'T', color: '#4285F4' },
  { ch: 'E', color: '#EA4335' },
  { ch: 'R', color: '#FBBC05' },
]

export default function Comet() {
  const [visible, setVisible] = useState(true)
  const [key, setKey] = useState(0)

  // Kila sekunde 10 — reset comet
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setKey((k) => k + 1)
        setVisible(true)
      }, 100)
    }, 10000)   // ← sekunde 10

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
      <motion.div
        key={key}
        initial={{ x: '130vw' }}
        animate={{ x: '-130vw' }}
        transition={{ duration: 4.5, ease: 'linear' }}
        className="absolute top-1/2 left-0 pointer-events-none"
        style={{ transform: 'translateY(-50%)' }}
      >
        {/* ===== COMET HEAD + TEXT ===== */}
        <div className="relative">
          {/* Glow 1 — kubwa sana */}
          <motion.div
            animate={{ opacity: [0, 1, 0.15, 1, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: '600px', height: '600px',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(66,133,244,0.6) 15%, rgba(52,168,83,0.3) 40%, transparent 70%)',
              filter: 'blur(35px)',
            }}
          />

          {/* Glow 2 — chromatic halo */}
          <motion.div
            animate={{ opacity: [0, 0.8, 0.1, 0.8, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: '360px', height: '360px',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(66,133,244,0.8) 0%, rgba(251,188,5,0.5) 30%, transparent 70%)',
              filter: 'blur(45px)',
            }}
          />

          {/* ===== MKIA 1 — wa nje mkubwa blurred ===== */}
          <motion.div
            animate={{ opacity: [0, 0.7, 0.1, 0.7, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: '100%',
              transform: 'translateY(-50%)',
              width: '90vw', maxWidth: '1200px', height: '90px',
              background:
                'linear-gradient(to right, rgba(255,255,255,0.9), rgba(66,133,244,0.7) 15%, rgba(52,168,83,0.4) 45%, rgba(251,188,5,0.15) 75%, transparent)',
              filter: 'blur(32px)',
              borderRadius: '999px',
            }}
          />

          {/* Mkia 2 — kati mkali */}
          <motion.div
            animate={{ opacity: [0, 1, 0.2, 1, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: '100%',
              transform: 'translateY(-50%)',
              width: '60vw', maxWidth: '800px', height: '16px',
              background:
                'linear-gradient(to right, rgba(255,255,255,1), rgba(66,133,244,0.9) 20%, rgba(52,168,83,0.6) 50%, rgba(251,188,5,0.3) 80%, transparent)',
              filter: 'blur(8px)',
              borderRadius: '999px',
              boxShadow: '0 0 45px rgba(66,133,244,0.9)',
            }}
          />

          {/* Mkia 3 — core mwembamba mkali */}
          <motion.div
            animate={{ opacity: [0, 1, 0.3, 1, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="absolute top-1/2 pointer-events-none"
            style={{
              left: '100%',
              transform: 'translateY(-50%)',
              width: '40vw', maxWidth: '500px', height: '4px',
              background:
                'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0.9) 30%, rgba(66,133,244,0.5) 70%, transparent)',
              filter: 'blur(1px)',
              borderRadius: '999px',
              boxShadow: '0 0 20px rgba(255,255,255,0.9), 0 0 40px rgba(66,133,244,0.8)',
            }}
          />

          {/* ===== MCENTER TEXT ===== */}
          <motion.div
            animate={{ opacity: [0, 1, 0.1, 1, 0] }}
            transition={{ duration: 4.5, times: [0, 0.15, 0.5, 0.85, 1], ease: 'linear' }}
            className="relative flex items-center justify-center"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.9))' }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={i}
                className="inline-block font-black select-none"
                style={{
                  color: l.color,
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                  textShadow: `
                    0 0 10px #ffffff,
                    0 0 20px ${l.color},
                    0 0 40px ${l.color},
                    0 0 80px ${l.color}cc,
                    0 0 140px ${l.color}88
                  `,
                }}
              >
                {l.ch}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
