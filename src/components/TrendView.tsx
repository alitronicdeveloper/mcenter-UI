import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, Loader2, ExternalLink } from 'lucide-react'
import { useStore } from '../store'
import { runSearch } from '../lib/search'

type Result = {
  id: string
  title: string
  url: string
  snippet: string
  source: string
  thumbnail?: string
}

export default function TrendView() {
  const { selectedTrend, setView, reset } = useStore()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const color = selectedTrend?.region === 'tz' ? '#34A853' : '#4285F4'

  useEffect(() => {
    if (!selectedTrend) return
    setLoading(true)
    setResults([])
    runSearch(selectedTrend.query, 'all')
      .then((res) => setResults(res))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedTrend])

  const back = () => {
    setView('universe')
    setTimeout(() => reset(), 300)
  }

  return (
    <AnimatePresence>
      {selectedTrend && (
        <motion.div
          key={selectedTrend.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40 flex flex-col"
          style={{
            // Background OPAQUE kabisa — dunia haipenyezi
            background: `linear-gradient(180deg, #0a0e1a 0%, #050810 40%, #000005 100%)`,
          }}
        >
          {/* Colored radial glow juu (decorative, sio transparent) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% -10%, ${color}30 0%, transparent 55%)`,
            }}
          />

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 md:px-8 py-5 border-b border-white/10 backdrop-blur-sm">
            <button
              onClick={back}
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs md:text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Universe
            </button>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" style={{ color }} />
              <span className="text-[10px] md:text-xs tracking-widest text-white/50">
                TRENDING {selectedTrend.region === 'tz' ? 'TANZANIA' : 'WORLD'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-thin">
            <div className="max-w-4xl mx-auto">

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black tracking-tight mb-2"
                style={{ color, textShadow: `0 0 60px ${color}` }}
              >
                {selectedTrend.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-white/50 text-xs md:text-sm tracking-widest mb-8"
              >
                ✦ HABARI NA MATOKEO KUHUSU "{selectedTrend.query}" ✦
              </motion.p>

              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color }} />
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="text-center py-16 text-white/40 text-sm">
                  Hakuna matokeo kwa sasa.
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-3">
                  {results.map((r, i) => (
                    <motion.a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      className="block p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition group"
                    >
                      <div className="flex items-start gap-4">
                        {r.thumbnail ? (
                          <img
                            src={r.thumbnail}
                            alt=""
                            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 bg-white/5"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                            style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
                          >
                            {i + 1}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm md:text-base font-semibold text-white group-hover:underline truncate">
                              {r.title}
                            </h3>
                            <ExternalLink className="w-3.5 h-3.5 text-white/40 shrink-0" />
                          </div>
                          <p className="text-[10px] md:text-xs mt-1 truncate" style={{ color }}>
                            {r.source}
                          </p>
                          <p className="text-xs md:text-sm text-white/60 mt-2 line-clamp-2 md:line-clamp-3">
                            {r.snippet}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
