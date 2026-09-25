import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../store'
import { TRENDING_TZ, TRENDING_WORLD, type Trend } from '../lib/trends'
import { getTrendImages } from '../lib/trendImages'

const VISIBLE = 2

export default function TrendingColumns({
  topOffset,
  isMobile,
}: {
  topOffset: string
  isMobile: boolean
}) {
  const { query, results, isSearching, view, setSelectedTrend, setView } = useStore()

  const [images, setImages] = useState<Record<string, string | null>>({})
  const [tzStart, setTzStart] = useState(0)
  const [tzDir, setTzDir] = useState<1 | -1>(1)
  const [worldStart, setWorldStart] = useState(0)
  const [worldDir, setWorldDir] = useState<1 | -1>(1)

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

  const tzMaxStart = Math.max(0, TRENDING_TZ.length - VISIBLE)
  const worldMaxStart = Math.max(0, TRENDING_WORLD.length - VISIBLE)

  const tzDown = () => { if (tzStart < tzMaxStart) { setTzDir(1); setTzStart(s => s + 1) } }
  const tzUp   = () => { if (tzStart > 0) { setTzDir(-1); setTzStart(s => s - 1) } }
  const worldDown = () => { if (worldStart < worldMaxStart) { setWorldDir(1); setWorldStart(s => s + 1) } }
  const worldUp   = () => { if (worldStart > 0) { setWorldDir(-1); setWorldStart(s => s - 1) } }

  const handleTzWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
    if (tzLock.current) return
    if (e.deltaY > 0) tzDown(); else if (e.deltaY < 0) tzUp(); else return
    tzLock.current = true
    setTimeout(() => { tzLock.current = false }, 700)
  }
  const handleWorldWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
    if (worldLock.current) return
    if (e.deltaY > 0) worldDown(); else if (e.deltaY < 0) worldUp(); else return
    worldLock.current = true
    setTimeout(() => { worldLock.current = false }, 700)
  }

  const handleTzTouchStart = (e: React.TouchEvent) => { tzTouchY.current = e.touches[0].clientY }
  const handleTzTouchEnd = (e: React.TouchEvent) => {
    const d = tzTouchY.current - e.changedTouches[0].clientY
    if (d > 30) tzDown(); else if (d < -30) tzUp()
  }
  const handleWorldTouchStart = (e: React.TouchEvent) => { worldTouchY.current = e.touches[0].clientY }
  const handleWorldTouchEnd = (e: React.TouchEvent) => {
    const d = worldTouchY.current - e.changedTouches[0].clientY
    if (d > 30) worldDown(); else if (d < -30) worldUp()
  }

  const visibleTz = TRENDING_TZ.slice(tzStart, tzStart + VISIBLE)
  const visibleWorld = TRENDING_WORLD.slice(worldStart, worldStart + VISIBLE)

  // =========================================================
  // ANIMATION — Card → STAR iliyoonekana wazi
  // Scroll down: card inapanda, inapungua polepole, inawaka, inatoweka juu
  // Scroll up: star ndogo inatoka juu, inashuka, inakua kuwa card
  // =========================================================
  const cardVariants = (direction: 1 | -1, color: string) => {
    if (direction === 1) {
      // ⬇️ SCROLL DOWN
      return {
        initial: {
          opacity: 0,
          y: '60vh',
          scale: 0.4,
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
        },
        exit: {
          // Card inabaki pale, inapungua, inakuwa duara lenye mwanga,
          // inapanda juu, inatoweka
          y: [0, 0, -80, -300, -600],
          scale: [1, 0.85, 0.5, 0.25, 0.05],
          opacity: [1, 1, 1, 1, 0],
          borderRadius: ['12px', '12px', '50%', '50%', '50%'],
          boxShadow: [
            `0 0 0px 0px ${color}00`,
            `0 0 20px 4px ${color}80`,
            `0 0 60px 20px ${color}cc`,
            `0 0 100px 40px ${color}aa`,
            `0 0 0px 0px ${color}00`,
          ],
          transition: {
            duration: 1.5,
            times: [0, 0.15, 0.45, 0.75, 1],
            ease: 'easeOut',
          },
        },
      }
    }
    // ⬆️ SCROLL UP
    return {
      initial: {
        // Star inaanza juu sana, ndogo, inaonekana kama dot
        opacity: 0,
        y: -600,
        scale: 0.05,
        borderRadius: '50%',
        boxShadow: `0 0 0px 0px ${color}00`,
      },
      animate: {
        // Keyframes: inatoka juu → inashuka → inakua → inakuwa card
        y: [-600, -300, -80, 0],
        scale: [0.05, 0.25, 0.5, 1],
        opacity: [0, 1, 1, 1],
        borderRadius: ['50%', '50%', '12px', '12px'],
        boxShadow: [
          `0 0 0px 0px ${color}00`,
          `0 0 100px 40px ${color}aa`,
          `0 0 60px 20px ${color}cc`,
          `0 0 0px 0px ${color}00`,
        ],
        transition: {
          duration: 1.5,
          times: [0, 0.3, 0.65, 1],
          ease: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        y: 60,
        scale: 0.4,
        transition: { duration: 0.5 },
      },
    }
  }

  const Card = ({ t, side, direction }: { t: Trend; side: 'left' | 'right'; direction: 1 | -1 }) => {
    const img = images[t.title]
    const color = side === 'left' ? '#34A853' : '#4285F4'
    const v = cardVariants(direction, color)

    return (
      <motion.button
        layout
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        onClick={() => openTrend(t)}
        className="w-full text-left rounded-xl bg-black/80 backdrop-blur-2xl border hover:bg-white/5 transition-colors duration-300 group overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
        style={{
          borderColor: `${color}33`,
          willChange: 'transform, opacity, border-radius, box-shadow',
        }}
      >
        <div className="w-full aspect-[16/10] bg-white/5 overflow-hidden relative">
          {img ? (
            <img
              src={img}
              alt={t.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-black" style={{ color }}>#{t.rank}</span>
            </div>
          )}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black"
            style={{ background: `${color}ee`, color: '#000' }}
          >
            #{t.rank}
          </div>
        </div>

        <div className="p-2.5 md:p-3">
          <h3 className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-1">
            {t.title}
          </h3>
          <p className="text-[10px] md:text-[11px] text-white/55 line-clamp-2 leading-snug mt-1">
            {t.description}
          </p>
        </div>
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="trends-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.4 }}
          className="fixed left-0 right-0 bottom-0 z-20"
          style={{ top: topOffset, pointerEvents: 'none' }}
        >
          <div className="h-full p-3 md:p-5 pt-4 md:pt-6 flex flex-col safe-bottom">
            <div className="flex-1 grid grid-cols-2 gap-3 md:gap-8 max-w-4xl mx-auto w-full min-h-0">

              {/* LEFT — TANZANIA */}
              <div className="flex flex-col min-h-0" style={{ pointerEvents: 'auto' }}>
                <div className="mb-2 flex items-center gap-1.5 px-1 shrink-0">
                  <TrendingUp className="w-3 h-3 text-[#34A853]" />
                  <span className="text-[9px] md:text-[10px] tracking-widest text-white/60">TRENDING TZ</span>
                  <span className="ml-auto text-[9px] text-white/30 tabular-nums">
                    {tzStart + 1}–{Math.min(tzStart + VISIBLE, TRENDING_TZ.length)}/{TRENDING_TZ.length}
                  </span>
                </div>

                <div
                  onWheel={handleTzWheel}
                  onTouchStart={handleTzTouchStart}
                  onTouchEnd={handleTzTouchEnd}
                  className="flex-1 space-y-2 md:space-y-2.5 relative"
                >
                  <AnimatePresence initial={false}>
                    {visibleTz.map((t) => <Card key={t.id} t={t} side="left" direction={tzDir} />)}
                  </AnimatePresence>
                </div>

                <div className="mt-1.5 flex items-center justify-center gap-1 shrink-0">
                  <button onClick={tzUp} disabled={tzStart === 0}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
                    <ChevronUp className="w-3 h-3 text-white/60" />
                  </button>
                  <button onClick={tzDown} disabled={tzStart >= tzMaxStart}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </button>
                </div>
              </div>

              {/* RIGHT — WORLD */}
              <div className="flex flex-col min-h-0" style={{ pointerEvents: 'auto' }}>
                <div className="mb-2 flex items-center gap-1.5 px-1 shrink-0">
                  <Globe className="w-3 h-3 text-[#4285F4]" />
                  <span className="text-[9px] md:text-[10px] tracking-widest text-white/60">TRENDING WORLD</span>
                  <span className="ml-auto text-[9px] text-white/30 tabular-nums">
                    {worldStart + 1}–{Math.min(worldStart + VISIBLE, TRENDING_WORLD.length)}/{TRENDING_WORLD.length}
                  </span>
                </div>

                <div
                  onWheel={handleWorldWheel}
                  onTouchStart={handleWorldTouchStart}
                  onTouchEnd={handleWorldTouchEnd}
                  className="flex-1 space-y-2 md:space-y-2.5 relative"
                >
                  <AnimatePresence initial={false}>
                    {visibleWorld.map((t) => <Card key={t.id} t={t} side="right" direction={worldDir} />)}
                  </AnimatePresence>
                </div>

                <div className="mt-1.5 flex items-center justify-center gap-1 shrink-0">
                  <button onClick={worldUp} disabled={worldStart === 0}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
                    <ChevronUp className="w-3 h-3 text-white/60" />
                  </button>
                  <button onClick={worldDown} disabled={worldStart >= worldMaxStart}
                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center">
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
