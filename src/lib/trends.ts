export type Trend = {
  id: string
  title: string
  query: string
  description: string
  region: 'tz' | 'world'
  rank: number
}

export const TRENDING_TZ: Trend[] = [
  { id: 'tz-1', rank: 1, title: 'Simba SC',         query: 'Simba SC',         description: 'Habari, matokeo, na updates za Simba Sports Club.', region: 'tz' },
  { id: 'tz-2', rank: 2, title: 'Yangaa',           query: 'Yangaa',           description: 'Timu na matukio ya Yangaa Africa.', region: 'tz' },
  { id: 'tz-3', rank: 3, title: 'Diamond Platnumz', query: 'Diamond Platnumz', description: 'Nyimbo mpya, video, na habari za Diamond.', region: 'tz' },
  { id: 'tz-4', rank: 4, title: 'Tanzania News',    query: 'Tanzania news',    description: 'Habari za hivi karibuni kutoka Tanzania.', region: 'tz' },
  { id: 'tz-5', rank: 5, title: 'Bongo Flava',      query: 'Bongo Flava',      description: 'Muziki wa Bongo Flava na wasanii wake.', region: 'tz' },
  { id: 'tz-6', rank: 6, title: 'Kilimanjaro',      query: 'Kilimanjaro',      description: 'Mlima Kilimanjaro, utalii, na historia.', region: 'tz' },
  { id: 'tz-7', rank: 7, title: 'Serengeti',        query: 'Serengeti',        description: 'Hifadhi ya Serengeti na wanyama wake.', region: 'tz' },
  { id: 'tz-8', rank: 8, title: 'Azam FC',          query: 'Azam FC',          description: 'Habari na matokeo ya Azam Football Club.', region: 'tz' },
]

export const TRENDING_WORLD: Trend[] = [
  { id: 'w-1', rank: 1, title: 'OpenAI',           query: 'OpenAI',           description: 'AI updates, GPT, na habari za OpenAI.', region: 'world' },
  { id: 'w-2', rank: 2, title: 'Bitcoin',          query: 'Bitcoin',          description: 'Bei, news, na uchambuzi wa Bitcoin.', region: 'world' },
  { id: 'w-3', rank: 3, title: 'Premier League',   query: 'Premier League',   description: 'Matokeo, fixtures, na habari za EPL.', region: 'world' },
  { id: 'w-4', rank: 4, title: 'iPhone 17',        query: 'iPhone 17',        description: 'Specs, reviews, na updates za iPhone mpya.', region: 'world' },
  { id: 'w-5', rank: 5, title: 'SpaceX',           query: 'SpaceX',           description: 'Missioni za SpaceX na Elon Musk.', region: 'world' },
  { id: 'w-6', rank: 6, title: 'AI News',          query: 'AI news',          description: 'Habari za AI kutoka duniani kote.', region: 'world' },
  { id: 'w-7', rank: 7, title: 'Champions League', query: 'Champions League', description: 'UEFA Champions League — matokeo na fixtures.', region: 'world' },
  { id: 'w-8', rank: 8, title: 'World Cup',        query: 'World Cup',        description: 'Kombe la Dunia — habari na ratiba.', region: 'world' },
]
