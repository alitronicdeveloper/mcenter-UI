import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { useStore } from '../store'

export default function SearchResults() {
  const { results, query, isSearching, setResults, activeTab } = useStore()
  const show = isSearching || results.length > 0
  const isImages = activeTab === 'images'

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35 }}
          className="fixed left-1/2 -translate-x-1/2 top-[calc(4rem+7rem)] md:top-[calc(1.5rem+7.5rem)] z-20 w-[min(960px,94vw)]"
        >
          <div className="rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.6)]">

            <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-white/10">
              <div className="text-xs text-white/50 tracking-widest truncate">
                {isSearching
                  ? `✦ SEARCHING ${activeTab.toUpperCase()}...`
                  : `✦ ${results.length} RESULTS — ${activeTab.toUpperCase()} — "${query}"`}
              </div>
              <button
                onClick={() => setResults([])}
                className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition shrink-0"
              >
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-2 scroll-thin">
              {isSearching && (
                <div className="space-y-2 p-2">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded-lg shimmer shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded shimmer" />
                        <div className="h-2 w-1/3 rounded shimmer" />
                        <div className="h-2 w-full rounded shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Images grid */}
              {!isSearching && isImages && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
                  {results.map((r, i) => (
                    <motion.a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#34A853]/50 transition"
                    >
                      {r.thumbnail ? (
                        <img
                          src={r.thumbnail}
                          alt={r.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30 text-xs p-2 text-center">
                          {r.title.slice(0, 40)}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                        <p className="text-[10px] text-white/90 line-clamp-2">{r.title}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {/* List results */}
              {!isSearching && !isImages && results.map((r, i) => (
                <motion.a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="block px-3 md:px-4 py-3 rounded-xl hover:bg-white/5 transition group"
                >
                  <div className="flex items-start gap-3">
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0 bg-white/5" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4285F4]/30 to-[#34A853]/30 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white/70">{i + 1}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#8ab4f8] group-hover:underline truncate">
                          {r.title}
                        </h3>
                        <ExternalLink className="w-3 h-3 text-white/30 shrink-0" />
                      </div>
                      <p className="text-[10px] text-[#34A853] mt-0.5 truncate">{r.source}</p>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">{r.snippet}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
