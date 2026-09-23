import type { SearchTab } from '../store'

export type SearchResult = {
  id: string
  title: string
  url: string
  snippet: string
  source: string
  thumbnail?: string
}

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '')

// ============== ALL ==============
async function searchAll(q: string): Promise<SearchResult[]> {
  const out: SearchResult[] = []

  // Wikipedia (sw)
  try {
    const r = await fetch(
      `https://sw.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*&srlimit=5`
    )
    const d = await r.json()
    ;(d.query?.search || []).forEach((item: any) => {
      out.push({
        id: `wiki-${item.pageid}`,
        title: item.title,
        url: `https://sw.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
        snippet: stripHtml(item.snippet) + '...',
        source: 'sw.wikipedia.org',
      })
    })
  } catch {}

  // DuckDuckGo instant answer
  try {
    const r = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`
    )
    const d = await r.json()
    if (d.AbstractText) {
      out.unshift({
        id: 'ddg-abstract',
        title: d.Heading || q,
        url: d.AbstractURL || '#',
        snippet: d.AbstractText,
        source: 'duckduckgo.com',
        thumbnail: d.Image ? `https://duckduckgo.com${d.Image}` : undefined,
      })
    }
  } catch {}

  // Google link ya mwisho
  out.push({
    id: 'google',
    title: `Tafuta "${q}" kwenye Google`,
    url: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
    snippet: 'Bonyeza kufungua matokeo kamili ya Google.',
    source: 'google.com',
  })

  return out
}

// ============== IMAGES ==============
async function searchImages(q: string): Promise<SearchResult[]> {
  // Wikipedia images (bure, CORS)
  const out: SearchResult[] = []
  try {
    const r = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        q
      )}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=300&format=json&origin=*`
    )
    const d = await r.json()
    const pages = d.query?.pages || {}
    Object.values(pages).forEach((p: any) => {
      const info = p.imageinfo?.[0]
      if (!info) return
      out.push({
        id: `img-${p.pageid}`,
        title: p.title.replace('File:', ''),
        url: info.descriptionurl || info.url,
        snippet: `Wikimedia Commons • ${p.title}`,
        source: 'commons.wikimedia.org',
        thumbnail: info.thumburl || info.url,
      })
    })
  } catch {}

  // Google Images link
  out.push({
    id: 'gimg',
    title: `Picha zaidi za "${q}" kwenye Google`,
    url: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`,
    snippet: 'Fungua picha zote za Google.',
    source: 'google.com',
  })

  return out
}

// ============== VIDEOS ==============
function searchVideos(q: string): SearchResult[] {
  return [
    {
      id: 'yt',
      title: `"${q}" kwenye YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
      snippet: 'Video zinazohusiana na swali lako.',
      source: 'youtube.com',
    },
    {
      id: 'mmovies',
      title: `"${q}" kwenye M Movies`,
      url: `http://mmovies.gt.tc/?s=${encodeURIComponent(q)}`,
      snippet: 'Tafuta kwenye library ya M Movies.',
      source: 'mmovies.gt.tc',
    },
    {
      id: 'gv',
      title: `Video za "${q}" kwenye Google`,
      url: `https://www.google.com/search?tbm=vid&q=${encodeURIComponent(q)}`,
      snippet: 'Video zaidi kutoka Google.',
      source: 'google.com',
    },
  ]
}

// ============== NEWS ==============
async function searchNews(q: string): Promise<SearchResult[]> {
  // Google News RSS kwa Kiswahili (Tanzania)
  const out: SearchResult[] = []
  try {
    const rss = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=sw&gl=TZ&ceid=TZ:sw`
    const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`)
    const d = await r.json()
    ;(d.items || []).slice(0, 12).forEach((item: any, i: number) => {
      out.push({
        id: `news-${i}`,
        title: item.title,
        url: item.link,
        snippet: stripHtml(item.description || '').slice(0, 180),
        source: item.author || 'google news',
        thumbnail: item.thumbnail || undefined,
      })
    })
  } catch {}

  if (out.length === 0) {
    out.push({
      id: 'gnews',
      title: `Habari za "${q}" kwenye Google News`,
      url: `https://news.google.com/search?q=${encodeURIComponent(q)}&hl=sw&gl=TZ&ceid=TZ:sw`,
      snippet: 'Fungua Google News kwa habari kamili.',
      source: 'news.google.com',
    })
  }

  return out
}

// ============== MAPS ==============
function searchMaps(q: string): SearchResult[] {
  return [
    {
      id: 'osm',
      title: `"${q}" kwenye OpenStreetMap`,
      url: `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`,
      snippet: 'Ramani ya bure na ya kujitolea.',
      source: 'openstreetmap.org',
    },
    {
      id: 'gmaps',
      title: `"${q}" kwenye Google Maps`,
      url: `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
      snippet: 'Ramani, mitaa, na biashara.',
      source: 'google.com/maps',
    },
    {
      id: 'bingmaps',
      title: `"${q}" kwenye Bing Maps`,
      url: `https://www.bing.com/maps?q=${encodeURIComponent(q)}`,
      snippet: 'Ramani ya Bing.',
      source: 'bing.com/maps',
    },
  ]
}

// ============== MAIN ==============
export async function runSearch(q: string, tab: SearchTab): Promise<SearchResult[]> {
  if (!q.trim()) return []
  switch (tab) {
    case 'images': return searchImages(q)
    case 'videos': return searchVideos(q)
    case 'news':   return searchNews(q)
    case 'maps':   return searchMaps(q)
    case 'all':
    default:       return searchAll(q)
  }
}
