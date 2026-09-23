const cache: Record<string, string | null> = {}

export async function getTrendImage(title: string): Promise<string | null> {
  if (title in cache) return cache[title]
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    )
    if (!r.ok) {
      cache[title] = null
      return null
    }
    const d = await r.json()
    const url = d.thumbnail?.source || null
    cache[title] = url
    return url
  } catch {
    cache[title] = null
    return null
  }
}

// Batch — pata picha kwa trends zote kwa parallel
export async function getTrendImages(titles: string[]): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    titles.map(async (t) => [t, await getTrendImage(t)] as const)
  )
  return Object.fromEntries(entries)
}
