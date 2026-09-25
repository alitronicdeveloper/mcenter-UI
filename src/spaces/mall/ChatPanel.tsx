import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Package, User, Check, CheckCheck } from 'lucide-react'
import { useChatStore } from './chat-store'
import { getSeller, getProduct, formatTZS } from './data'

export default function ChatPanel() {
  const {
    customer, setCustomer,
    threads, activeThreadId, setActiveThreadId,
    isOpen, activeSellerId, activeProductId, closeChat,
    findThread, startThread, sendMessage, markReadByCustomer, autoReplyFromSeller,
  } = useChatStore()

  const [text, setText] = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const [nameInput, setNameInput] = useState(customer?.name || '')
  const [phoneInput, setPhoneInput] = useState(customer?.phone || '')
  const scrollRef = useRef<HTMLDivElement>(null)

  const seller = activeSellerId ? getSeller(activeSellerId) : null
  const product = activeProductId ? getProduct(activeProductId) : undefined

  // Anzisha thread
  useEffect(() => {
    if (!isOpen || !seller) return

    // Kama customer haipo, weka guest
    if (!customer) {
      setCustomer({ name: 'Mteja', phone: '+255 000 000 000' })
      return
    }

    const existing = findThread(seller.id, activeProductId)
    if (existing) {
      setActiveThreadId(existing.id)
      markReadByCustomer(existing.id)
    } else {
      const id = startThread(seller.id, activeProductId)
      setActiveThreadId(id)
    }
  }, [isOpen, seller?.id, customer, activeProductId])

  const thread = threads.find((t) => t.id === activeThreadId)

  // Scroll chini kila message mpya
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [thread?.messages.length, isOpen])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThreadId || !text.trim()) return
    sendMessage(activeThreadId, text, 'customer')
    setText('')
    if (seller) autoReplyFromSeller(activeThreadId, seller.name)
  }

  const saveProfile = () => {
    if (!nameInput.trim() || !phoneInput.trim()) {
      alert('Jaza jina na namba ya simu')
      return
    }
    setCustomer({ name: nameInput.trim(), phone: phoneInput.trim() })
    setShowProfile(false)
  }

  if (!seller) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-[100] bg-[#0a0a14] border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#0d0d18] shrink-0">
              <img src={seller.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{seller.name}</h3>
                <p className="text-[10px] text-[#34A853] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />
                  Online sasa
                </p>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                title="Mipangilio yangu"
              >
                <User className="w-4 h-4 text-white/60" />
              </button>
              <button
                onClick={closeChat}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Product context */}
            {product && (
              <div className="flex items-center gap-2.5 p-2.5 border-b border-white/10 bg-white/[0.02] shrink-0">
                <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/40 tracking-widest flex items-center gap-1">
                    <Package className="w-2.5 h-2.5" /> KUHUSU
                  </p>
                  <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                  <p className="text-[11px] text-[#FBBC05] font-bold">{formatTZS(product.price)}</p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-3 space-y-2">
              <div className="text-center text-[10px] text-white/30 py-2">
                M Chat • Mawasiliano salama kati yako na muuzaji
              </div>

              {thread?.messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#34A853]/20 mx-auto mb-3 flex items-center justify-center">
                    <Send className="w-5 h-5 text-[#34A853]" />
                  </div>
                  <p className="text-xs text-white/60 mb-1">Anza mazungumzo</p>
                  <p className="text-[10px] text-white/40">Uliza kuhusu bidhaa, bei, delivery, au warranty</p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3 px-2">
                    {['Bei ni ngapi?', 'Ipo stock?', 'Delivery siku ngapi?', 'Una warranty?'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setText(q)}
                        className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {thread?.messages.map((m) => {
                const isMe = m.from === 'customer'
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#4285F4] text-white rounded-br-sm'
                          : 'bg-white/10 text-white/90 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <div className={`flex items-center gap-1 justify-end mt-0.5 text-[9px] ${isMe ? 'text-white/70' : 'text-white/40'}`}>
                        {new Date(m.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        {isMe && (m.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Input */}
            <form onSubmit={submit} className="p-3 border-t border-white/10 bg-[#0d0d18] shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 focus-within:border-[#4285F4]/60 transition">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Andika ujumbe..."
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="w-8 h-8 rounded-full bg-[#4285F4] hover:bg-[#4285F4]/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </form>

            {/* Profile Modal */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center p-4"
                  onClick={() => setShowProfile(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-sm rounded-2xl bg-[#0a0a14] border border-white/10 p-5"
                  >
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#4285F4]" /> Taarifa Zako
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-white/60 mb-1.5 block">Jina lako</label>
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Mfano: Juma Mwinyi"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#4285F4]/60 outline-none text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/60 mb-1.5 block">Namba ya simu</label>
                        <input
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+255 7XX XXX XXX"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#4285F4]/60 outline-none text-sm text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={() => setShowProfile(false)}
                        className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition"
                      >
                        Ghairi
                      </button>
                      <button
                        onClick={saveProfile}
                        className="flex-1 py-2 rounded-lg bg-[#4285F4] hover:bg-[#4285F4]/90 text-xs font-bold transition"
                      >
                        Hifadhi
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
