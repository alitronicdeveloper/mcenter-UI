import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Search, ShoppingCart, Star, ArrowLeft, Plus, Minus,
  Check, Phone, MapPin, CreditCard, ChevronRight,
  Verified, Trash2, Package, Home as HomeIcon, MessageSquare,
  Sparkles, ArrowRight,
} from 'lucide-react'
import type { Product, CartItem, Order } from './mall/types'
import {
  PRODUCTS, SELLERS, CATEGORIES,
  getSeller, getProduct, getProductsBySeller, getProductsByCategory,
  formatTZS,
} from './mall/data'
import { useChatStore } from './mall/chat-store'

type MallView = 'home' | 'category' | 'store' | 'product' | 'cart' | 'checkout' | 'orders' | 'success'

const CART_KEY = 'mcenter:mall-cart'
const ORDERS_KEY = 'mcenter:mall-orders'

const loadCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]') } catch { return [] }
}
const saveCart = (c: CartItem[]) => localStorage.setItem(CART_KEY, JSON.stringify(c))
const loadOrders = (): Order[] => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') } catch { return [] }
}
const saveOrders = (o: Order[]) => localStorage.setItem(ORDERS_KEY, JSON.stringify(o))

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Overline({ children, color = '#FBBC05' }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="h-px w-8" style={{ background: color }} />
      <span className="text-[10px] tracking-[0.4em] font-semibold" style={{ color }}>{children}</span>
    </div>
  )
}

export default function MallSpace() {
  const [view, setView] = useState<MallView>('home')
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [orders, setOrders] = useState<Order[]>(loadOrders)
  const [showCartToast, setShowCartToast] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)

  const openChat = useChatStore((s) => s.openChat)

  useEffect(() => { saveCart(cart) }, [cart])
  useEffect(() => { saveOrders(orders) }, [orders])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [view])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const addToCart = (productId: string, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.productId === productId)
      if (existing) return c.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + qty } : i)
      return [...c, { productId, quantity: qty }]
    })
    setShowCartToast(true)
    setTimeout(() => setShowCartToast(false), 1800)
  }

  const removeFromCart = (productId: string) => setCart((c) => c.filter((i) => i.productId !== productId))
  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId)
    setCart((c) => c.map((i) => i.productId === productId ? { ...i, quantity: qty } : i))
  }
  const clearCart = () => setCart([])

  const goProduct = (id: string) => { setSelectedProduct(id); setView('product') }
  const goStore = (id: string) => { setSelectedSeller(id); setView('store') }
  const goCategory = (id: string) => { setSelectedCategory(id); setView('category') }

  const placeOrder = (order: Order) => {
    setOrders((o) => [order, ...o])
    setLastOrder(order)
    clearCart()
    setView('success')
  }

  const cartProducts = cart.map((i) => ({ item: i, product: getProduct(i.productId)! })).filter((x) => x.product)

  return (
    <div className="max-w-[1500px] mx-auto px-3 md:px-6">
      <AnimatePresence>
        {showCartToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-black text-sm font-bold shadow-2xl flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #FBBC05, #FF8C00)' }}
          >
            <Check className="w-4 h-4" /> Imeongezwa kwenye cart
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
        <button
          onClick={() => setView('home')}
          className={`flex items-center gap-1.5 text-xs tracking-widest transition pb-1 border-b ${
            view === 'home' ? 'text-[#FBBC05] border-[#FBBC05]' : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          <HomeIcon className="w-3.5 h-3.5" /> NYUMBANI
        </button>
        <button
          onClick={() => setView('orders')}
          className={`flex items-center gap-1.5 text-xs tracking-widest transition pb-1 border-b ${
            view === 'orders' ? 'text-[#FBBC05] border-[#FBBC05]' : 'text-white/50 border-transparent hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" /> ODA ZANGU
        </button>
        <div className="ml-auto">
          <button
            onClick={() => setView('cart')}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition text-xs tracking-widest"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            CART
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EA4335] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {view === 'home' && <HomeView onCategory={goCategory} onProduct={goProduct} onStore={goStore} searchQ={searchQ} setSearchQ={setSearchQ} />}
      {view === 'category' && selectedCategory && (
        <CategoryView categoryId={selectedCategory} onProduct={goProduct} onBack={() => setView('home')} searchQ={searchQ} setSearchQ={setSearchQ} />
      )}
      {view === 'store' && selectedSeller && (
        <StoreView sellerId={selectedSeller} onProduct={goProduct} onBack={() => setView('home')} onChat={openChat} />
      )}
      {view === 'product' && selectedProduct && (
        <ProductView productId={selectedProduct} onAdd={addToCart} onStore={goStore} onBack={() => setView('home')} onProduct={goProduct} onChat={openChat} />
      )}
      {view === 'cart' && (
        <CartView cart={cartProducts} onUpdate={updateQty} onRemove={removeFromCart} onBack={() => setView('home')} onCheckout={() => setView('checkout')} onProduct={goProduct} />
      )}
      {view === 'checkout' && (
        <CheckoutView cart={cartProducts} onBack={() => setView('cart')} onPlace={placeOrder} />
      )}
      {view === 'orders' && <OrdersView orders={orders} onBack={() => setView('home')} />}
      {view === 'success' && lastOrder && (
        <SuccessView order={lastOrder} onHome={() => setView('home')} onOrders={() => setView('orders')} />
      )}
    </div>
  )
}

function HomeView({ onCategory, onProduct, onStore, searchQ, setSearchQ }: {
  onCategory: (id: string) => void
  onProduct: (id: string) => void
  onStore: (id: string) => void
  searchQ: string
  setSearchQ: (q: string) => void
}) {
  const featured = PRODUCTS.filter((p) => p.featured)
  const trending = PRODUCTS.filter((p) => p.trending)
  const deals = PRODUCTS.filter((p) => p.oldPrice).slice(0, 12)
  const results = useMemo(() => {
    if (!searchQ.trim()) return []
    const q = searchQ.toLowerCase()
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)))
  }, [searchQ])

  if (searchQ.trim()) {
    return (
      <div>
        <div className="mb-4">
          <Overline>MATOKEO</Overline>
          <h2 className="text-2xl md:text-3xl font-light tracking-tight">
            "{searchQ}" — <span className="italic font-serif text-[#FBBC05]">{results.length} bidhaa</span>
          </h2>
        </div>
        <ProductGrid products={results} onProduct={onProduct} emptyText="Hakuna bidhaa inayolingana" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a05 0%, #2a1005 50%, #1a0a05 100%)' }}
      >
        <div className="absolute inset-0 opacity-60"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(251,188,5,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,140,0,0.2) 0%, transparent 60%)',
          }}
        />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#FBBC05] to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#FBBC05] to-transparent" />
        </div>

        <div className="relative px-6 md:px-12 py-10 md:py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.9 }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#FBBC05]" />
              <span className="text-[10px] tracking-[0.4em] font-semibold text-[#FBBC05]">MCENTER MALL</span>
              <div className="h-px w-8 bg-[#FBBC05]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight mb-4"
          >
            <span className="block text-white">Ulimwengu wa</span>
            <span className="block italic font-serif"
              style={{
                background: 'linear-gradient(135deg, #FBBC05, #FF8C00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              Bidhaa Halisi
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="text-xs md:text-sm text-white/50 max-w-xl mx-auto font-light mb-8"
          >
            Wauzaji 10 waliothibitishwa · Bidhaa halisi · Delivery haraka
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 focus-within:border-[#FBBC05]/50 transition">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Tafuta bidhaa..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30 tracking-wide"
              />
              <button className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FBBC05] to-[#FF8C00] shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <Overline>CHAGUA KATEGORIA</Overline>
            <span className="text-[10px] text-white/30 tracking-widest">{CATEGORIES.length} CATEGORIES</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onCategory(c.id)}
                className="group p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-[#FBBC05]/50 transition flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl md:text-3xl group-hover:scale-110 transition">{c.icon}</span>
                <span className="text-[10px] text-white/70 text-center leading-tight group-hover:text-[#FBBC05] transition-colors">{c.name}</span>
              </button>
            ))}
          </div>
        </section>
      </FadeIn>

      {deals.length > 0 && (
        <FadeIn>
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Overline color="#EA4335">OFFERS ZA LEO</Overline>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Deals <span className="italic font-serif text-[#FBBC05]">Maalum</span>
                </h2>
              </div>
              <span className="text-[10px] text-[#EA4335] font-bold tracking-widest">
                🔥 {deals.length} OFFERS
              </span>
            </div>
            <ProductGrid products={deals} onProduct={onProduct} />
          </section>
        </FadeIn>
      )}

      {featured.length > 0 && (
        <FadeIn>
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Overline>CURATED</Overline>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Bidhaa <span className="italic font-serif text-[#FBBC05]">Maalum</span>
                </h2>
              </div>
              <span className="text-[10px] text-white/30 tracking-widest">{featured.length} BIDHAA</span>
            </div>
            <ProductGrid products={featured} onProduct={onProduct} />
          </section>
        </FadeIn>
      )}

      {trending.length > 0 && (
        <FadeIn>
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <Overline color="#34A853">IN DEMAND</Overline>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                  Zinazouzwa <span className="italic font-serif text-[#FBBC05]">Sana</span>
                </h2>
              </div>
              <span className="text-[10px] text-white/30 tracking-widest">{trending.length} BIDHAA</span>
            </div>
            <ProductGrid products={trending} onProduct={onProduct} />
          </section>
        </FadeIn>
      )}

      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Overline>COLLECTION</Overline>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                Bidhaa <span className="italic font-serif text-[#FBBC05]">Zote</span>
              </h2>
            </div>
            <span className="text-[10px] text-white/30 tracking-widest">{PRODUCTS.length} BIDHAA</span>
          </div>
          <ProductGrid products={PRODUCTS} onProduct={onProduct} />
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <Overline>PARTNERS</Overline>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                Wauzaji <span className="italic font-serif text-[#FBBC05]">Bora</span>
              </h2>
            </div>
            <span className="text-[10px] text-white/30 tracking-widest">{SELLERS.length} STORES</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {SELLERS.map((s) => (
              <StoreCardCompact key={s.id} seller={s} onClick={() => onStore(s.id)} />
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}

function ProductGrid({ products, onProduct, emptyText }: {
  products: Product[]
  onProduct: (id: string) => void
  emptyText?: string
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Sparkles className="w-8 h-8 text-white/15 mx-auto mb-3" />
        <p className="text-white/40 text-sm">{emptyText || 'Hakuna bidhaa'}</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
      {products.map((p, i) => (
        <FadeIn key={p.id} delay={Math.min(i, 6) * 0.02}>
          <ProductCardElegant product={p} onClick={() => onProduct(p.id)} />
        </FadeIn>
      ))}
    </div>
  )
}

function ProductCardElegant({ product, onClick }: { product: Product; onClick: () => void }) {
  const seller = getSeller(product.sellerId)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl overflow-hidden border border-white/8 hover:border-[#FBBC05]/50 transition-all duration-500"
      style={{
        background: 'linear-gradient(160deg, rgba(251,188,5,0.02) 0%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: 'inset 0 0 40px rgba(251,188,5,0.25)' }} />

        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] tracking-widest font-bold text-black"
            style={{ background: 'linear-gradient(135deg, #FBBC05, #FF8C00)' }}>
            -{discount}%
          </div>
        )}

        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur text-[9px] tracking-widest font-bold text-[#FBBC05]">
            {product.stock} LEFT
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[10px] tracking-[0.3em] text-white/80">IMEISHA</span>
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <div className="text-center py-2 rounded-full bg-black/60 backdrop-blur text-[9px] tracking-[0.3em] text-[#FBBC05] font-semibold">
            VIEW
          </div>
        </div>
      </div>

      <div className="p-2.5 md:p-3">
        {seller && (
          <p className="text-[8px] md:text-[9px] tracking-[0.3em] text-[#FBBC05]/70 mb-1 truncate">
            {seller.name.toUpperCase()}
          </p>
        )}

        <h3 className="text-[11px] md:text-xs font-light text-white leading-tight line-clamp-2 min-h-[28px] group-hover:text-[#FBBC05] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" />
          <span className="text-[9px] text-white/50">{product.rating}</span>
          <span className="text-[9px] text-white/25">·</span>
          <span className="text-[9px] text-white/40">{product.soldCount} sold</span>
        </div>

        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xs md:text-sm font-light text-[#FBBC05]">{formatTZS(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[9px] text-white/25 line-through">{formatTZS(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </button>
  )
}

function StoreCardCompact({ seller, onClick }: { seller: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full p-3 rounded-xl border border-white/8 hover:border-[#FBBC05]/50 transition-all duration-500 text-left"
      style={{
        background: 'linear-gradient(160deg, rgba(251,188,5,0.02) 0%, rgba(255,255,255,0.02) 100%)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <img src={seller.logo} alt={seller.name} className="w-11 h-11 rounded-full object-cover shrink-0 border border-white/10 group-hover:border-[#FBBC05]/50 transition" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="text-xs font-light text-white truncate group-hover:text-[#FBBC05] transition-colors">{seller.name}</h3>
            {seller.verified && <Verified className="w-3 h-3 text-[#4285F4] shrink-0" />}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white/40 mt-0.5">
            <Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" />
            <span>{seller.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[9px] tracking-widest text-white/30 group-hover:text-[#FBBC05] transition-colors">
        <MapPin className="w-2.5 h-2.5" />
        <span className="truncate">{seller.location.toUpperCase()}</span>
      </div>
    </button>
  )
}

function CategoryView({ categoryId, onProduct, onBack, searchQ, setSearchQ }: {
  categoryId: string
  onProduct: (id: string) => void
  onBack: () => void
  searchQ: string
  setSearchQ: (q: string) => void
}) {
  const cat = CATEGORIES.find((c) => c.id === categoryId)
  const products = getProductsByCategory(categoryId)
  const filtered = searchQ.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase()))
    : products

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div className="text-center py-8 border-b border-white/5">
        <div className="text-5xl md:text-6xl mb-4">{cat?.icon}</div>
        <Overline color={cat?.color}>{String(products.length).padStart(2, '0')} BIDHAA</Overline>
        <h1 className="text-3xl md:text-5xl font-light tracking-tight">
          <span className="italic font-serif" style={{ color: cat?.color }}>{cat?.name}</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 focus-within:border-[#FBBC05]/50 transition">
          <Search className="w-4 h-4 text-white/40" />
          <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Tafuta kwenye category..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30 tracking-wide" />
        </div>
      </div>

      <ProductGrid products={filtered} onProduct={onProduct} />
    </div>
  )
}

function StoreView({ sellerId, onProduct, onBack, onChat }: {
  sellerId: string
  onProduct: (id: string) => void
  onBack: () => void
  onChat: (sellerId: string, productId?: string) => void
}) {
  const seller = getSeller(sellerId)
  const products = getProductsBySeller(sellerId)
  if (!seller) return null

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div className="relative rounded-2xl overflow-hidden h-40 md:h-56">
        <img src={seller.banner} alt={seller.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000005] via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end gap-3">
          <img src={seller.logo} alt={seller.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-[#000005] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-2xl font-light text-white truncate">{seller.name}</h1>
              {seller.verified && <Verified className="w-4 h-4 md:w-5 md:h-5 text-[#4285F4] shrink-0" />}
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/70 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#FBBC05]" fill="#FBBC05" /> {seller.rating} ({seller.reviews})</span>
              <span>·</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {seller.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => onChat(seller.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-xs font-bold tracking-widest hover:opacity-90 transition">
          <MessageSquare className="w-3.5 h-3.5" /> CHAT
        </button>
        <a href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold tracking-widest transition">
          WHATSAPP
        </a>
        <a href={`tel:${seller.phone}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold tracking-widest transition">
          <Phone className="w-3.5 h-3.5" /> PIGA SIMU
        </a>
      </div>

      <p className="text-sm text-white/60 max-w-2xl font-light leading-relaxed">{seller.description}</p>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Overline>BIDHAA</Overline>
          <span className="text-[10px] text-white/30 tracking-widest">{products.length} ITEMS</span>
        </div>
        <ProductGrid products={products} onProduct={onProduct} />
      </div>
    </div>
  )
}

function ProductView({ productId, onAdd, onStore, onBack, onProduct, onChat }: {
  productId: string
  onAdd: (id: string, qty: number) => void
  onStore: (id: string) => void
  onBack: () => void
  onProduct: (id: string) => void
  onChat: (sellerId: string, productId?: string) => void
}) {
  const product = getProduct(productId)
  const [imgIndex, setImgIndex] = useState(0)
  const [qty, setQty] = useState(1)
  if (!product) return null

  const seller = getSeller(product.sellerId)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const similar = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6)

  return (
    <div className="space-y-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
            <motion.img
              key={imgIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={product.images[imgIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    i === imgIndex ? 'border-[#FBBC05]' : 'border-white/10 hover:border-white/30'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {seller && (
            <p className="text-[10px] tracking-[0.4em] text-[#FBBC05] mb-3">{seller.name.toUpperCase()}</p>
          )}

          <h1 className="text-2xl md:text-4xl font-light tracking-tight mb-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-white/60 mb-5">
            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#FBBC05]" fill="#FBBC05" /> {product.rating} ({product.reviewsCount})</span>
            <span>·</span>
            <span>{product.soldCount} zimeuzwa</span>
          </div>

          <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-white/10">
            <span className="text-3xl md:text-4xl font-light text-[#FBBC05]">{formatTZS(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-base text-white/40 line-through">{formatTZS(product.oldPrice)}</span>
                <span className="text-xs font-bold text-white bg-[#EA4335] px-2.5 py-1 rounded-full tracking-widest">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-5 font-light">{product.description}</p>

          <div className="flex items-center gap-2 mb-5">
            <span className={`text-xs tracking-widest font-semibold ${product.stock > 0 ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
              {product.stock > 0 ? `✓ ZIPO ${product.stock}` : '✗ IMEISHA'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-full p-1 border border-white/10">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-light w-10 text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => onAdd(product.id, qty)}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] hover:opacity-90 text-black font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition">
                <ShoppingCart className="w-4 h-4" /> ONGEZA CART
              </button>
            </div>
          )}

          {seller && (
            <>
              <button
                onClick={() => onChat(seller.id, product.id)}
                className="w-full mb-3 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm tracking-widest flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4 text-[#FBBC05]" />
                CHAT NA MUUZAJI
              </button>

              <button onClick={() => onStore(seller.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
                <img src={seller.logo} alt={seller.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-light text-white truncate">{seller.name}</h3>
                    {seller.verified && <Verified className="w-3.5 h-3.5 text-[#4285F4]" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5 tracking-wide">
                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" /> {seller.rating}</span>
                    <span>·</span>
                    <span>{seller.location}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/30" />
              </button>
            </>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <Overline>UNAWEZA KUPENDA</Overline>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight">
              Bidhaa <span className="italic font-serif text-[#FBBC05]">Zinazofanana</span>
            </h2>
          </div>
          <ProductGrid products={similar} onProduct={onProduct} />
        </div>
      )}
    </div>
  )
}

function CartView({ cart, onUpdate, onRemove, onBack, onCheckout, onProduct }: {
  cart: { item: CartItem; product: Product }[]
  onUpdate: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onBack: () => void
  onCheckout: () => void
  onProduct: (id: string) => void
}) {
  const subtotal = cart.reduce((s, x) => s + x.product.price * x.item.quantity, 0)
  const deliveryFee = cart.length > 0 ? 10000 : 0
  const total = subtotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="w-16 h-16 text-white/15 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-light mb-3">Cart yako ni <span className="italic font-serif text-[#FBBC05]">tupu</span></h2>
        <p className="text-sm text-white/50 mb-8 font-light">Anza kuongeza bidhaa unazopenda</p>
        <button onClick={onBack}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm font-bold tracking-widest hover:opacity-90 transition">
          ANZA KUNUNUA
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> ENDELEA KUNUNUA
      </button>

      <div>
        <Overline>{String(cart.length).padStart(2, '0')} BIDHAA</Overline>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          Cart <span className="italic font-serif text-[#FBBC05]">Yako</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {cart.map(({ item, product }) => {
            const seller = getSeller(product.sellerId)
            return (
              <div key={product.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <button onClick={() => onProduct(product.id)} className="shrink-0">
                  <img src={product.images[0]} alt={product.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-white/10" />
                </button>
                <div className="flex-1 min-w-0">
                  {seller && (
                    <p className="text-[9px] tracking-[0.3em] text-[#FBBC05]/70 mb-1 truncate">{seller.name.toUpperCase()}</p>
                  )}
                  <button onClick={() => onProduct(product.id)} className="text-left">
                    <h3 className="text-sm font-light text-white truncate hover:text-[#FBBC05] transition">{product.name}</h3>
                  </button>
                  <p className="text-base font-light text-[#FBBC05] mt-1">{formatTZS(product.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-black/40 rounded-full p-0.5 border border-white/10">
                      <button onClick={() => onUpdate(product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-light w-6 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdate(product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => onRemove(product.id)}
                      className="w-7 h-7 rounded-full hover:bg-red-500/20 flex items-center justify-center transition">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 sticky top-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#FBBC05]" />
              <span className="text-[10px] tracking-[0.4em] text-[#FBBC05] font-semibold">MUHTASARI</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/60"><span className="font-light">Subtotal</span><span>{formatTZS(subtotal)}</span></div>
              <div className="flex justify-between text-white/60"><span className="font-light">Delivery</span><span>{formatTZS(deliveryFee)}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                <span className="text-xs tracking-widest text-white/50">JUMLA</span>
                <span className="text-2xl font-light text-[#FBBC05]">{formatTZS(total)}</span>
              </div>
            </div>
            <button onClick={onCheckout}
              className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black font-bold text-sm tracking-widest hover:opacity-90 transition">
              ENDELEA CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutView({ cart, onBack, onPlace }: {
  cart: { item: CartItem; product: Product }[]
  onBack: () => void
  onPlace: (order: Order) => void
}) {
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '',
    payment: 'M-Pesa', notes: '',
  })
  const subtotal = cart.reduce((s, x) => s + x.product.price * x.item.quantity, 0)
  const deliveryFee = 10000
  const total = subtotal + deliveryFee

  const paymentMethods = ['M-Pesa', 'Tigo Pesa', 'Airtel Money', 'Halopesa', 'Cash on Delivery']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address || !form.city) {
      alert('Jaza taarifa zote muhimu')
      return
    }
    const order: Order = {
      id: 'MC-' + Date.now().toString(36).toUpperCase(),
      items: cart.map(({ item, product }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
        sellerName: getSeller(product.sellerId)?.name || '',
      })),
      customerName: form.name,
      customerPhone: form.phone,
      address: form.address,
      city: form.city,
      paymentMethod: form.payment,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: form.notes,
    }
    onPlace(order)
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div>
        <Overline>HATUA YA MWISHO</Overline>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          <span className="italic font-serif text-[#FBBC05]">Checkout</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-5">
              <MapPin className="w-4 h-4 text-[#FBBC05]" />
              <span className="text-[10px] tracking-[0.4em] text-[#FBBC05] font-semibold">TAARIFA ZA DELIVERY</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="JINA KAMILI *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jina lako" />
              <Input label="SIMU *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+255 7XX XXX XXX" type="tel" />
              <div className="sm:col-span-2">
                <Input label="ANWANI *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Mtaa, nyumba, landmark" />
              </div>
              <Input label="MJI *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Dar es Salaam" />
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-3 mb-5">
              <CreditCard className="w-4 h-4 text-[#FBBC05]" />
              <span className="text-[10px] tracking-[0.4em] text-[#FBBC05] font-semibold">NJIA YA MALIPO</span>
            </div>
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <label key={m} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  form.payment === m ? 'bg-[#FBBC05]/10 border-[#FBBC05]/60' : 'border-white/10 hover:bg-white/5'
                }`}>
                  <input type="radio" name="payment" checked={form.payment === m}
                    onChange={() => setForm({ ...form, payment: m })} className="accent-[#FBBC05]" />
                  <span className="text-sm font-light tracking-wide">{m}</span>
                </label>
              ))}
            </div>
            <div className="mt-5">
              <label className="text-[10px] tracking-[0.3em] text-white/50 mb-2 block">MAELEZO YA ZIADA</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2} placeholder="Maelezo kwa muuzaji..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FBBC05]/60 outline-none text-sm text-white placeholder-white/20 resize-none font-light" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 sticky top-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#FBBC05]" />
              <span className="text-[10px] tracking-[0.4em] text-[#FBBC05] font-semibold">ODA YAKO</span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto scroll-thin mb-4">
              {cart.map(({ item, product }) => (
                <div key={product.id} className="flex items-center gap-2 text-xs">
                  <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-white/80 font-light">{product.name}</p>
                    <p className="text-white/40 text-[10px] tracking-wide">{item.quantity} × {formatTZS(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/60"><span className="font-light">Subtotal</span><span>{formatTZS(subtotal)}</span></div>
              <div className="flex justify-between text-white/60"><span className="font-light">Delivery</span><span>{formatTZS(deliveryFee)}</span></div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="text-xs tracking-widest text-white/50">JUMLA</span>
                <span className="text-2xl font-light text-[#FBBC05]">{formatTZS(total)}</span>
              </div>
            </div>
            <button type="submit"
              className="w-full mt-5 py-4 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black font-bold text-sm tracking-widest hover:opacity-90 transition flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> WEKA ODA
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="text-[10px] tracking-[0.3em] text-white/50 mb-2 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-[#FBBC05]/60 outline-none text-sm text-white placeholder-white/20 transition font-light" />
    </div>
  )
}

function OrdersView({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-white/15 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-light mb-3">Hauna oda <span className="italic font-serif text-[#FBBC05]">bado</span></h2>
        <button onClick={onBack}
          className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm font-bold tracking-widest">
          ANZA KUNUNUA
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div>
        <Overline>{String(orders.length).padStart(2, '0')} ODA</Overline>
        <h1 className="text-3xl md:text-4xl font-light tracking-tight">
          Oda <span className="italic font-serif text-[#FBBC05]">Zangu</span>
        </h1>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <FadeIn key={o.id}>
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                  <p className="text-[10px] tracking-[0.3em] text-white/40">ODA #{o.id}</p>
                  <p className="text-xs text-white/50 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest bg-[#FBBC05]/15 text-[#FBBC05] border border-[#FBBC05]/40">
                  {o.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={it.image} alt="" className="w-12 h-12 rounded object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light truncate text-white/80">{it.name}</p>
                      <p className="text-[10px] text-white/40 tracking-wide mt-0.5">
                        {it.quantity} × {formatTZS(it.price)} · {it.sellerName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs tracking-widest text-white/40">{o.paymentMethod.toUpperCase()}</span>
                <span className="text-xl font-light text-[#FBBC05]">{formatTZS(o.total)}</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

function SuccessView({ order, onHome, onOrders }: { order: Order; onHome: () => void; onOrders: () => void }) {
  return (
    <div className="text-center py-16 max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FBBC05] to-[#FF8C00] flex items-center justify-center mx-auto mb-8"
      >
        <Check className="w-12 h-12 text-black" strokeWidth={3} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-[#FBBC05]" />
          <span className="text-[10px] tracking-[0.4em] text-[#FBBC05] font-semibold">ASANTE</span>
          <div className="h-px w-8 bg-[#FBBC05]" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-3xl md:text-5xl font-light tracking-tight mb-4"
      >
        Oda <span className="italic font-serif text-[#FBBC05]">Imewekwa</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-sm text-white/50 mb-10 font-light"
      >
        Asante kwa kununua kupitia M Mall
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 mb-8 text-left"
      >
        <p className="text-[10px] tracking-[0.3em] text-white/40 mb-2">ODA ID</p>
        <p className="text-lg font-mono font-bold text-[#FBBC05] mb-4">{order.id}</p>
        <p className="text-[10px] tracking-[0.3em] text-white/40 mb-2">JUMLA</p>
        <p className="text-2xl font-light text-white mb-4">{formatTZS(order.total)}</p>
        <p className="text-xs text-white/50 leading-relaxed font-light">
          Muuzaji atawasiliana nawe kwa <b className="text-white/80">{order.customerPhone}</b> kuhusu delivery na malipo.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onHome}
          className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm tracking-widest font-light transition">
          ENDELEA KUNUNUA
        </button>
        <button onClick={onOrders}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm tracking-widest font-bold hover:opacity-90 transition">
          ODA ZANGU
        </button>
      </div>
    </div>
  )
}
