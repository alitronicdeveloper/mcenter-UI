import { motion } from 'framer-motion'
import { Lock, User, ArrowRight, Key, Shield, FileText, BarChart3, Users } from 'lucide-react'

const FEATURES = [
  { icon: FileText,  title: 'Invoices',   desc: 'Angalia na lipa ankara zako.' },
  { icon: BarChart3, title: 'Reports',    desc: 'Ripoti za matumizi na analytics.' },
  { icon: Users,     title: 'Team',       desc: 'Simamia watumiaji wa timu yako.' },
  { icon: Shield,    title: 'Security',   desc: '2FA na audit logs.' },
]

export default function PortalSpace() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        {/* Left: Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#4285F4] flex items-center justify-center">
              <Key className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                <span className="text-[#0EA5E9]">M</span> <span className="text-white">PORTAL</span>
              </h1>
              <p className="text-white/50 text-xs md:text-sm tracking-widest">YOUR GATEWAY</p>
            </div>
          </div>
          <p className="text-white/60 text-sm md:text-base mb-6 md:mb-8">
            Ingia kwenye akaunti yako kusimamia huduma, ankara, na miradi yako ya MCenter.
          </p>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10">
                <f.icon className="w-4 h-4 md:w-5 md:h-5 text-[#0EA5E9] mb-2" />
                <h3 className="text-xs md:text-sm font-bold text-white">{f.title}</h3>
                <p className="text-[10px] md:text-xs text-white/50 mt-0.5">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Login form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-[#0EA5E9]" />
            <span className="text-[10px] tracking-widest text-white/50">SECURE LOGIN</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black mb-5">Karibu tena</h2>

          <form onSubmit={(e) => { e.preventDefault(); alert('Sign-in — coming soon'); }} className="space-y-4">
            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus-within:border-[#0EA5E9]/60 transition">
                <User className="w-4 h-4 text-white/40" />
                <input type="email" placeholder="wewe@mcenter.co.tz"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30" />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus-within:border-[#0EA5E9]/60 transition">
                <Lock className="w-4 h-4 text-white/40" />
                <input type="password" placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded" />
                Nikumbuke
              </label>
              <a href="#" className="text-[#0EA5E9] hover:underline">Umesahau password?</a>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#4285F4] hover:opacity-90 text-white font-bold text-sm flex items-center justify-center gap-2 transition">
              Ingia <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-white/40 pt-2">
              Hauna akaunti? <a href="#" className="text-[#0EA5E9] hover:underline">Unda mpya</a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
