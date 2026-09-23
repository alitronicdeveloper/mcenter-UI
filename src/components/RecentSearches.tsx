import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { runSearch } from '../lib/search'

export default function RecentSearches() {
  const {
    recentSearches, removeRecentSearch, clearRecentSearches,
    query, results, isSearching, setQuery, setIsSearching, setResults,
    addRecentSearch, view,
  } = useStore()

  const show =
    !query.trim() &&
    results.length === 0 &&
    !isSearching &&
    view === 'universe' &&
    recentSearches.length > 0

  const handleClick = async (q: string) => {
    setQuery(q)
    addRecentSearch(q)
    setIsSearching(true)
    setResults([])
    try {
      const res = await runSearch(q, useStore.getState().activeTab)
      setResults(res)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 w-[min(560px,88vw)]"
        >
          <div className="rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/10 p-3 md:p-4 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[10px] text-white/40 tracking-widest">
                <Clock className="w-3 h-3" />
                RECENT SEARCHES
              </div>
              <button
                onClick={clearRecentSearches}
                className="flex items-center gap-1 text-[10px] text-white/40 hover:text-red-400 transition"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {recentSearches.slice(0, 6).map((q) => (
                <div
                  key={q}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition cursor-pointer"
                >
                  <span
                    onClick={() => handleClick(q)}
                    className="text-xs text-white/80 truncate max-w-[140px]"
                  >
                    {q}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeRecentSearch(q) }}
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shrink-0"
                  >
                    <X className="w-2.5 h-2.5 text-white/50 hover:text-white" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
