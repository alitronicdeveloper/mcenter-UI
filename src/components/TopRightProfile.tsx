import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogIn, Settings, LogOut, HelpCircle } from 'lucide-react'

export default function TopRightProfile() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="fixed top-2 md:top-6 right-2 md:right-6 z-40 safe-top">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 md:gap-2 pl-0.5 md:pl-1 pr-2 md:pr-4 py-0.5 md:py-1 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 hover:bg-white/5 transition"
      >
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center text-white font-bold text-xs shadow-[0_0_15px_rgba(66,133,244,0.5)]">
          M
        </div>
        <span className="text-[11px] md:text-xs text-white/80 hidden sm:inline">Account</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-1.5 md:mt-2 w-52 md:w-56 rounded-2xl bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="px-3 md:px-4 py-2 md:py-3 border-b border-white/10">
              <p className="text-[10px] md:text-xs text-white/40 tracking-widest">SIGNED OUT</p>
              <p className="text-xs md:text-sm text-white font-semibold mt-0.5">MCenter Guest</p>
            </div>
            <div className="py-1">
              <button onClick={() => { window.location.href = '/login' }}
                className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-white/80 hover:bg-white/5 transition">
                <LogIn className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#34A853]" /> Sign in
              </button>
              <button className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-white/80 hover:bg-white/5 transition">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#4285F4]" /> Create account
              </button>
              <div className="my-1 border-t border-white/10" />
              <button className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-white/80 hover:bg-white/5 transition">
                <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" /> Settings
              </button>
              <button className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-white/80 hover:bg-white/5 transition">
                <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/60" /> Help
              </button>
              <div className="my-1 border-t border-white/10" />
              <button className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm text-red-400/80 hover:bg-red-500/10 transition">
                <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
