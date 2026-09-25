import { useRef, useState } from 'react'
import { Search, Mic, MicOff, Camera, X } from 'lucide-react'
import { useStore, type SearchTab } from '../store'
import { runSearch } from '../lib/search'

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

const TABS: { id: SearchTab; label: string; color: string }[] = [
  { id: 'all',    label: 'All',    color: '#4285F4' },
  { id: 'images', label: 'Images', color: '#34A853' },
  { id: 'videos', label: 'Videos', color: '#EA4335' },
  { id: 'news',   label: 'News',   color: '#FBBC05' },
  { id: 'maps',   label: 'Maps',   color: '#A855F7' },
]

export default function SearchBar() {
  const {
    query, setQuery, activeTab, setActiveTab,
    setIsSearching, setResults, addRecentSearch,
  } = useStore()

  const [listening, setListening] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startVoice = () => {
    if (!SpeechRecognition) { alert('Voice search haitumiki. Tumia Chrome.'); return }
    const r = new SpeechRecognition()
    r.lang = 'sw-TZ'
    r.interimResults = false
    r.maxAlternatives = 1
    r.onstart = () => setListening(true)
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      setQuery(t)
      doSearch(t)
    }
    r.start()
    recognitionRef.current = r
  }
  const stopVoice = () => { recognitionRef.current?.stop(); setListening(false) }

  const openImagePicker = () => fileInputRef.current?.click()
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImagePreview(dataUrl)
      window.open('https://lens.google.com/uploadbyurl?url=' + encodeURIComponent(dataUrl), '_blank')
    }
    reader.readAsDataURL(file)
  }

  const doSearch = async (q: string) => {
    if (!q.trim()) return
    addRecentSearch(q)
    setIsSearching(true)
    setResults([])
    try {
      const res = await runSearch(q, activeTab)
      setResults(res)
    } catch {
      setResults([{ id: 'err', title: 'Hitilafu', url: '#', snippet: 'Imeshindwa kupata matokeo.', source: 'mcenter' }])
    } finally { setIsSearching(false) }
  }

  const changeTab = (t: SearchTab) => {
    setActiveTab(t)
    if (query.trim()) doSearch(query)
  }

  return (
    <>
      <div className="fixed top-2 md:top-6 left-1/2 -translate-x-1/2 z-30 w-[min(860px,94vw)] safe-top">
        {/* Search bar */}
        <div className="flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 shadow-[0_0_45px_rgba(66,133,244,0.25)]">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-white/60 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch(query)}
            placeholder="Search anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-white/40 text-sm min-w-0"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]) }}
              className="w-6 h-6 md:w-7 md:h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition shrink-0">
              <X className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/60" />
            </button>
          )}
          <button onClick={listening ? stopVoice : startVoice}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition shrink-0 ${
              listening ? 'bg-red-500/20 animate-pulse' : 'hover:bg-white/10'
            }`}>
            {listening ? <MicOff className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
                       : <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#4285F4]" />}
          </button>
          <button onClick={openImagePicker}
            className="hidden sm:flex w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-white/10 items-center justify-center transition shrink-0">
            <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#34A853]" />
          </button>
          <button onClick={() => doSearch(query)}
            className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center hover:scale-105 transition shrink-0">
            <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </button>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="mt-1.5 md:mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar px-1 justify-start md:justify-center">
          {TABS.map((t) => {
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => changeTab(t.id)}
                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-sm whitespace-nowrap transition border shrink-0 ${
                  active
                    ? 'text-white font-semibold'
                    : 'text-white/55 hover:text-white border-transparent hover:border-white/10'
                }`}
                style={active
                  ? { background: `${t.color}22`, borderColor: `${t.color}66`, boxShadow: `0 0 20px ${t.color}44` }
                  : {}}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {listening && (
          <div className="mt-1.5 md:mt-2 text-center text-[10px] md:text-xs text-red-300 animate-pulse">
            🎤 Nasikiliza...
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

      {imagePreview && (
        <div className="fixed bottom-24 md:bottom-6 right-3 md:right-6 z-30 w-20 h-20 md:w-32 md:h-32 rounded-xl md:rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          <button onClick={() => setImagePreview(null)}
            className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/70 flex items-center justify-center">
            <X className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
          </button>
        </div>
      )}
    </>
  )
}
