import { create } from 'zustand'

type View = 'universe' | 'service' | 'trend'
export type SearchTab = 'all' | 'images' | 'videos' | 'news' | 'maps'

type Result = {
  id: string
  title: string
  url: string
  snippet: string
  source: string
  thumbnail?: string
}

type Trend = {
  id: string
  title: string
  query: string
  region: 'tz' | 'world'
  rank: number
}

type State = {
  view: View
  selectedService: string | null
  setSelectedService: (s: string | null) => void
  setView: (v: View) => void

  selectedTrend: Trend | null
  setSelectedTrend: (t: Trend | null) => void

  query: string
  setQuery: (q: string) => void

  activeTab: SearchTab
  setActiveTab: (t: SearchTab) => void

  results: Result[]
  setResults: (r: Result[]) => void

  isSearching: boolean
  setIsSearching: (b: boolean) => void

  recentSearches: string[]
  addRecentSearch: (q: string) => void
  removeRecentSearch: (q: string) => void
  clearRecentSearches: () => void

  loading: boolean
  setLoading: (b: boolean) => void

  reset: () => void
}

const loadRecent = (): string[] => {
  try {
    const raw = localStorage.getItem('mcenter:recent')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const saveRecent = (arr: string[]) => {
  try { localStorage.setItem('mcenter:recent', JSON.stringify(arr)) } catch {}
}

export const useStore = create<State>((set, get) => ({
  view: 'universe',
  selectedService: null,
  setSelectedService: (s) => set({ selectedService: s }),
  setView: (v) => set({ view: v }),

  selectedTrend: null,
  setSelectedTrend: (t) => set({ selectedTrend: t }),

  query: '',
  setQuery: (q) => set({ query: q }),

  activeTab: 'all',
  setActiveTab: (t) => set({ activeTab: t }),

  results: [],
  setResults: (r) => set({ results: r }),

  isSearching: false,
  setIsSearching: (b) => set({ isSearching: b }),

  recentSearches: loadRecent(),
  addRecentSearch: (q) => {
    const trimmed = q.trim()
    if (!trimmed) return
    const current = get().recentSearches.filter((s) => s !== trimmed)
    const next = [trimmed, ...current].slice(0, 8)
    saveRecent(next)
    set({ recentSearches: next })
  },
  removeRecentSearch: (q) => {
    const next = get().recentSearches.filter((s) => s !== q)
    saveRecent(next)
    set({ recentSearches: next })
  },
  clearRecentSearches: () => {
    saveRecent([])
    set({ recentSearches: [] })
  },

  loading: true,
  setLoading: (b) => set({ loading: b }),

  reset: () => set({
    view: 'universe',
    selectedService: null,
    selectedTrend: null,
    query: '',
    results: [],
  }),
}))
