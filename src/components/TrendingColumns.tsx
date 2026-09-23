import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Globe, ChevronUp, ChevronDown } from 'lucide-react'
import { useStore } from '../store'
import { TRENDING_TZ, TRENDING_WORLD, type Trend } from '../lib/trends'
import { getTrendImages } from '../lib/trendImages'

const VISIBLE = 3

export default function TrendingColumns() {
  const {
    query, results, isSearching, view,
    setSelectedTrend, setView,
  } = useStore()

  const [images, setImages] = useState<Record<string, string | null>>({})
  const [tzStart, setTzStart] = useState(0)
  const [worldStart, setWorldStart] = useState(0)

  const tzLock = useRef(false)
  const worldLock = useRef(false)
  const tzTouchY = useRef(0)
  const worldTouchY = useRef(0)

  useEffect(() => {
    const all = [...TRENDING_TZ, ...TRENDING_WORLD].map((t) => t.title)
    getTrendImages(all).then(setImages)
  }, [])

  const show = !query.trim() && results.length === 0 && !isSearching && view === 'universe'

  const openTrend = (t: Trend) => {
    setSelectedTrend(t)
    setTimeout(() => setView('trend'), 300)
  }

  // === SCROLL LOGIC ===
  const tzDown = () => {
    if (tzStart + VISIBLE < TRENDING_TZ.length) setTzStart((s) => s + 1)
  }
  const tzUp = () => {
    if (tzStart > 0) setTzStart((s) => s - 1)
  }
  const worldDown = () => {
    if (worldStart + VISIBLE < TRENDING_WORLD.length) setWorldStart((s) => s + 1)
  }
  const worldUp = () => {
    if (worldStart > 0) setWorldStart((s) => s - 1)
  }

  const handleTzWheel = (e: React.WheelEvent) => {
    if (tzLock.current) return
    if (e.deltaY > 0) tzDown()
    else if (e.deltaY < 0) tzUp()
    else return
    tzLock.current = true
    setTimeout(() => { tzLock.current = false }, 450)
  }
  const handleWorldWheel = (e: React.WheelEvent) => {
    if (worldLock.current) return
    if (e.deltaY > 0) worldDown()
    else if (e.deltaY < 0) worldUp()
    else return
    worldLock.current = true
    setTimeout(() => { worldLock.current = false }, 450)
  }

  const handleTzTouchStart = (e: React.TouchEvent) => {
    tzTouchY.current = e.touches[0].clientY
  }
  const handleTzTouchEnd = (e: React.TouchEvent) => {
    const diff = tzTouchY.current - e.changedTouches[0].clientY
    if (diff > 30) tzDown()
    else if (diff < -30) tzUp()
  }
  const handleWorldTouchStart = (e: React.TouchEvent) => {
    worldTouchY.current = e.touches[0].clientY
  }
  const handleWorldTouchEnd = (e: React.TouchEvent) => {
    const diff = worldTouchY.current - e.changedTouches[0].clientY
    if (diff > 30) worldDown()
    else if (diff < -30) worldUp()
  }

  const visibleTz = TRENDING_TZ.slice(tzStart, tzStart + VISIBLE)
  const visibleWorld = TRENDING_WORLD.slice(worldStart, worldStart + VISIBLE)

  // === CARD ANIMATION ===
  // Kila card inaanza katikati ya screen (dunia) kisha inasafiri hadi column
  const cardVariants = (side: 'left' | 'right', i: number) => ({
    initial: {
      opacity: 0,
      x: side === 'left' ? '48vw' : '-48vw',   // kutoka katikati ya screen (dunia)
      y: 0,
      scale: 0.25,
      filter: 'blur(14px)',
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.08,
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      x: side === 'left' ? '-50vw' : '50vw',   // inatoka kwa margin
      scale: 0.3,
      filter: 'blur(12px)',
      transition: {
        duration: 0.9,
        ease: [0.7, 0, 0.84, 0] as const,
      },
    },
  })

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* === VERTICAL LINE — KUSHOTO === */}
          <motion.div
            key="line-left"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="fixed z-10 pointer-events-none origin-center"
            style={{
              left: 'clamp(170px, 17vw, 230px)',
              top: '15%',
              bottom: '15%',
              width: '1px',
              background:
                'linear-gradient(to bottom, transparent, rgba(52,168,83,0.4) 20%, rgba(52,168,83,0.4) 80%, transparent)',
            }}
          />

          {/* === VERTICAL LINE — KULIA === */}
          <motion.div
            key="line-right"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="fixed z-10 pointer-events-none origin-center"
            style={{
              right: 'clamp(170px, 17vw, 230px)',
              top: '15%',
              bottom: '15%',
              width: '1px',
              background:
                'linear-gradient(to bottom, transparent, rgba(66,133,244,0.4) 20%, rgba(66,133,244,0.4) 80%, transparent)',
            }}
          />

          {/* === LEFT COLUMN — TANZANIA === */}
          <motion.div
            key="left-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
            className="fixed z-20 pointer-events-none"
            style={{
              left: 'clamp(10px, 1.5vw, 26px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(150px, 14.5vw, 200px)',
            }}
          >
            <div className="mb-2 flex items-center gap-1.5 px-2">
              <TrendingUp className="w-3 h-3 text-[#34A853]" />
              <span className="text-[9px] md:text-[10px] tracking-widest text-white/60">
                TRENDING TZ
              </span>
              <ChevronDown className="w-3 h-3 text-white/30 ml-auto" />
            </div>

            <div
              onWheel={handleTzWheel}
              onTouchStart={handleTzTouchStart}
              onTouchEnd={handleTzTouchEnd}
              className="space-y-2 pointer-events-auto relative"
              style={{ minHeight: '480px' }}
            >
              <AnimatePresence mode="popLayout">
                {visibleTz.map((t, i) => {
                  const img = images[t.title]
                  const v = cardVariants('left', i)
                  return (
                    <motion.button
                      key={t.id}
                      layout
                      initial={v.initial}
                      animate={v.animate}
                      exit={v.exit}
                      onClick={() => openTrend(t)}
                      className="w-full text-left rounded-xl bg-black/75 backdrop-blur-2xl border border-white/10 hover:border-[#34A853]/60 hover:bg-[#34A853]/10 transition-colors duration-300 group overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                    >
                      <div className="w-full aspect-[16/10] bg-white/5 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={t.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-black text-[#34A853]/50">
                              #{t.rank}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-black text-[#34A853]">
                            #{t.rank}
                          </span>
                          <h3 className="text-[11px] md:text-xs font-bold text-white truncate flex-1">
                            {t.title}
                          </h3>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-white/50 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Scroll controls */}
            <div className="mt-2 flex items-center justify-center gap-1">
              <button
                onClick={tzUp}
                disabled={tzStart === 0}
                className="w-6 h-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center pointer-events-auto"
              >
                <ChevronUp className="w-3 h-3 text-white/60" />
              </button>
              <span className="text-[9px] text-white/40 tabular-nums">
                {tzStart + 1}–{Math.min(tzStart + VISIBLE, TRENDING_TZ.length)} / {TRENDING_TZ.length}
              </span>
              <button
                onClick={tzDown}
                disabled={tzStart + VISIBLE >= TRENDING_TZ.length}
                className="w-6 h-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center pointer-events-auto"
              >
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
            </div>
          </motion.div>

          {/* === RIGHT COLUMN — WORLD === */}
          <motion.div
            key="right-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
            className="fixed z-20 pointer-events-none"
            style={{
              right: 'clamp(10px, 1.5vw, 26px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(150px, 14.5vw, 200px)',
            }}
          >
            <div className="mb-2 flex items-center gap-1.5 px-2 justify-end">
              <ChevronDown className="w-3 h-3 text-white/30 mr-auto" />
              <span className="text-[9px] md:text-[10px] tracking-widest text-white/60">
                TRENDING WORLD
              </span>
              <Globe className="w-3 h-3 text-[#4285F4]" />
            </div>

            <div
              onWheel={handleWorldWheel}
              onTouchStart={handleWorldTouchStart}
              onTouchEnd={handleWorldTouchEnd}
              className="space-y-2 pointer-events-auto relative"
              style={{ minHeight: '480px' }}
            >
              <AnimatePresence mode="popLayout">
                {visibleWorld.map((t, i) => {
                  const img = images[t.title]
                  const v = cardVariants('right', i)
                  return (
                    <motion.button
                      key={t.id}
                      layout
                      initial={v.initial}
                      animate={v.animate}
                      exit={v.exit}
                      onClick={() => openTrend(t)}
                      className="w-full text-left rounded-xl bg-black/75 backdrop-blur-2xl border border-white/10 hover:border-[#4285F4]/60 hover:bg-[#4285F4]/10 transition-colors duration-300 group overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                    >
                      <div className="w-full aspect-[16/10] bg-white/5 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={t.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-black text-[#4285F4]/50">
                              #{t.rank}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-[11px] md:text-xs font-bold text-white truncate flex-1">
                            {t.title}
                          </h3>
                          <span className="text-[9px] font-black text-[#4285F4]">
                            #{t.rank}
                          </span>
                        </div>
                        <p className="text-[9px] md:text-[10px] text-white/50 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1">
              <button
                onClick={worldUp}
                disabled={worldStart === 0}
                className="w-6 h-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center pointer-events-auto"
              >
                <ChevronUp className="w-3 h-3 text-white/60" />
              </button>
              <span className="text-[9px] text-white/40 tabular-nums">
                {worldStart + 1}–{Math.min(worldStart + VISIBLE, TRENDING_WORLD.length)} / {TRENDING_WORLD.length}
              </span>
              <button
                onClick={worldDown}
                disabled={worldStart + VISIBLE >= TRENDING_WORLD.length}
                className="w-6 h-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center pointer-events-auto"
              >
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
