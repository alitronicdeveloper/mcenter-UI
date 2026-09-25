import { motion } from 'framer-motion'
import {
  Globe, ShieldCheck, Wifi, Camera, Server, Cpu, Smartphone, Code2,
  ArrowRight, Phone, Mail, MessageCircle
} from 'lucide-react'

const SERVICES = [
  { icon: Globe,        title: 'Web Development',   desc: 'Website, web app, e-commerce. React, Node, WordPress.', color: '#4285F4' },
  { icon: ShieldCheck,  title: 'Cybersecurity',     desc: 'Audit, penetration testing, firewall, training.',       color: '#34A853' },
  { icon: Wifi,         title: 'Networking',        desc: 'LAN, WiFi, VPN, mikrotik, ubiquiti installations.',     color: '#FBBC05' },
  { icon: Camera,       title: 'CCTV & Security',   desc: 'Camera installation, access control, alarm systems.',   color: '#EA4335' },
  { icon: Server,       title: 'Server Setup',      desc: 'Linux, Windows Server, cloud hosting, backups.',        color: '#A855F7' },
  { icon: Cpu,          title: 'POS Systems',       desc: 'Point-of-sale, inventory, receipt printers.',           color: '#FF8C00' },
  { icon: Smartphone,   title: 'Mobile Apps',       desc: 'Android, iOS, React Native, Flutter.',                  color: '#14B8A6' },
  { icon: Code2,        title: 'Custom Software',   desc: 'ERP, CRM, dashboards, automation.',                     color: '#0EA5E9' },
]

export default function ITServiceSpace() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-[#FF8C00] to-[#EA4335] flex items-center justify-center">
            <Server className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              <span className="text-[#FF8C00]">M</span> <span className="text-white">ITSERVICE</span>
            </h1>
            <p className="text-white/50 text-xs md:text-sm tracking-widest">TECH THAT WORKS</p>
          </div>
        </div>
        <p className="text-white/60 text-sm md:text-base max-w-2xl">
          Suluhisho kamili za IT kwa biashara na taasisi — kutoka mtandao hadi software maalum.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition cursor-pointer"
            style={{ borderColor: `${s.color}22` }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
              <s.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: s.color }} />
            </div>
            <h3 className="text-sm md:text-base font-bold text-white mb-1">{s.title}</h3>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed">{s.desc}</p>
            <div className="mt-3 flex items-center gap-1 text-[10px] md:text-xs font-semibold"
              style={{ color: s.color }}>
              Jifunze zaidi <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#FF8C00]/15 to-[#EA4335]/15 border border-white/10"
      >
        <h2 className="text-xl md:text-3xl font-black mb-2">Unahitaji msaada wa IT?</h2>
        <p className="text-white/60 text-sm md:text-base mb-5 max-w-2xl">
          Wasiliana nasi leo kwa ushauri wa bure na quote ya haraka.
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <a href="tel:+255778743765"
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white text-xs md:text-sm font-bold transition">
            <Phone className="w-4 h-4" /> Piga Simu
          </a>
          <a href="https://wa.me/255778743765" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs md:text-sm font-bold transition">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <a href="mailto:info@mcenter.co.tz"
            className="flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold transition">
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>
      </motion.div>
    </div>
  )
}
