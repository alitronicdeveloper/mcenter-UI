import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Heart, ExternalLink } from 'lucide-react'

const WORKS = [
  { id: 1, title: 'MCenter Brand', tag: 'Branding', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600' },
  { id: 2, title: 'E-Commerce UI', tag: 'Web Design', img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600' },
  { id: 3, title: 'Mobile App UI', tag: 'App Design', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600' },
  { id: 4, title: 'Dashboard Concept', tag: 'Dashboard', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600' },
  { id: 5, title: 'Poster Series', tag: 'Print', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600' },
  { id: 6, title: 'Social Media Kit', tag: 'Social', img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600' },
]

const TAGS = ['All', 'Branding', 'Web Design', 'App Design', 'Dashboard', 'Print', 'Social']

export default function DesignSpace() {
  const [active, setActive] = useState('All')
  const filtered = WORKS.filter((w) => active === 'All' || w.tag === active)

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#4285F4] flex items-center justify-center">
            <Palette className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              <span className="text-[#A855F7]">M</span> <span className="text-white">DESIGN</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm tracking-widest">CREATE THE FUTURE</p>
          </div>
        </div>
        <p className="text-white/60 text-sm md:text-base">Portfolio ya designs za kisasa — UI, branding, print, na zaidi.</p>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
        {TAGS.map((t) => (
          <button key={t} onClick={() => setActive(t)}
            className={`px-3.5 md:px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition border ${
              active === t ? 'bg-[#A855F7]/20 text-white border-[#A855F7]/60'
                          : 'text-white/60 border-white/10 hover:bg-white/5'
            }`}>{t}</button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
        {filtered.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#A855F7]/60 transition cursor-pointer break-inside-avoid"
          >
            <img src={w.img} alt={w.title} loading="lazy"
              className="w-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] tracking-widest text-[#A855F7] mb-1">{w.tag.toUpperCase()}</p>
                <h3 className="text-sm md:text-base font-bold text-white mb-2">{w.title}</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-white transition">
                    <Heart className="w-3 h-3" /> Like
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] text-white transition">
                    <ExternalLink className="w-3 h-3" /> View
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
