import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Play, Star } from 'lucide-react'

const MOCK_MOVIES = [
  { id: 1, title: 'Black Panther', year: 2018, rating: 8.1, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w300/uxzzxijgPIY7slzFvMotPv8wjKA.jpg' },
  { id: 2, title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: 3, title: 'The Lion King', year: 1994, rating: 8.5, genre: 'Animation', poster: 'https://image.tmdb.org/t/p/w300/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg' },
  { id: 4, title: 'Interstellar', year: 2014, rating: 8.6, genre: 'Sci-Fi', poster: 'https://image.tmdb.org/t/p/w300/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: 5, title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w300/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  { id: 6, title: 'Joker', year: 2019, rating: 8.4, genre: 'Drama', poster: 'https://image.tmdb.org/t/p/w300/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
  { id: 7, title: 'Avengers: Endgame', year: 2019, rating: 8.4, genre: 'Action', poster: 'https://image.tmdb.org/t/p/w300/or06FN3Dka5tukK1e9sl16pB3iy.jpg' },
  { id: 8, title: 'Parasite', year: 2019, rating: 8.5, genre: 'Thriller', poster: 'https://image.tmdb.org/t/p/w300/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg' },
]

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Animation', 'Thriller']

export default function MoviesSpace() {
  const [active, setActive] = useState('All')
  const [q, setQ] = useState('')

  const filtered = MOCK_MOVIES
    .filter((m) => active === 'All' || m.genre === active)
    .filter((m) => m.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#EA4335] to-[#FBBC05] flex items-center justify-center">
            <Play className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              <span className="text-[#EA4335]">M</span> <span className="text-white">MOVIES</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm tracking-widest">CINEMATIC UNIVERSE</p>
          </div>
        </div>
        <p className="text-white/60 text-sm md:text-base max-w-2xl">
          Tafuta filamu, series, na animations kutoka duniani kote. Stream moja kwa moja.
        </p>
      </motion.div>

      <div className="mb-5 md:mb-6 space-y-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 focus-within:border-[#EA4335]/50 transition">
          <Search className="w-4 h-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tafuta filamu..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActive(g)}
              className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition border ${
                active === g
                  ? 'bg-[#EA4335]/20 text-white border-[#EA4335]/60'
                  : 'text-white/60 border-white/10 hover:bg-white/5'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-[#EA4335]/60 transition">
              <img
                src={m.poster}
                alt={m.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" />
                <span className="text-[10px] font-bold text-white">{m.rating}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <button className="w-full py-2 rounded-lg bg-[#EA4335] hover:bg-[#EA4335]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition">
                    <Play className="w-3 h-3" fill="white" /> Tazama
                  </button>
                </div>
              </div>
            </div>
            <h3 className="mt-2 text-xs md:text-sm font-semibold text-white truncate">{m.title}</h3>
            <p className="text-[10px] md:text-xs text-white/40">{m.year} • {m.genre}</p>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/40 text-sm">
          Hakuna filamu inayolingana.
        </div>
      )}

      <div className="mt-8 text-center text-[10px] md:text-xs text-white/30 tracking-widest">
        ✦ MCENTER MEDIA ✦ {MOCK_MOVIES.length} FILAMU
      </div>
    </div>
  )
}
