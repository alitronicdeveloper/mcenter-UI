import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Search, ShoppingCart, Star, ArrowLeft, Plus, Minus, X,
  Check, Phone, MapPin, CreditCard, Truck, Shield, ChevronRight,
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

      {/* ============ HEADER ============ */}
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

// ============================================================
// HOME — Amazon compact style
// ============================================================
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
          <h2 className="text-lg font-medium">
            Matokeo ya <span className="text-[#FBBC05]">"{searchQ}"</span>
          </h2>
          <p className="text-xs text-white/40 mt-1">{results.length} bidhaa zimepatikana</p>
        </div>
        <ProductGrid products={results} onProduct={onProduct} emptyText="Hakuna bidhaa inayolingana" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ============ HERO — compact, bright ============ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FBBC05 0%, #FF8C00 60%, #EA4335 100%)',
        }}
      >
        <div className="relative px-6 md:px-12 py-8 md:py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-2xl md:text-4xl font-black text-black mb-2 leading-tight"
          >
            Nunua kutoka Wauzaji 10 Waliothibitishwa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-black/70 text-xs md:text-sm mb-5"
          >
            Bidhaa halisi · Delivery haraka · Malipo salama
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white shadow-xl">
              <Search className="w-4 h-4 text-black/40 shrink-0" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Tafuta bidhaa — simu, kitenge, viungo..."
                className="flex-1 bg-transparent outline-none text-sm text-black placeholder-black/40"
              />
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FBBC05] to-[#FF8C00] flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ============ QUICK CATEGORIES — horizontal ============ */}
      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold">Kategoria</h2>
            <span className="text-[10px] text-white/40 tracking-widest">{CATEGORIES.length} CATEGORIES</span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => onCategory(c.id)}
                className="group p-3 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-[#FBBC05]/50 transition flex flex-col items-center gap-1.5"
              >
                <span className="text-2xl md:text-3xl group-hover:scale-110 transition">{c.icon}</span>
                <span className="text-[10px] text-white/70 text-center leading-tight">{c.name}</span>
              </button>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ============ DEALS — compact grid ============ */}
      {deals.length > 0 && (
        <FadeIn>
          <section className="p-3 md:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EA4335] animate-pulse" />
                <h2 className="text-base md:text-lg font-bold">Deals za Leo</h2>
              </div>
              <span className="text-[10px] text-[#EA4335] font-bold tracking-widest">
                🔥 {deals.length} OFFERS
              </span>
            </div>
            <ProductGrid products={deals} onProduct={onProduct} compact />
          </section>
        </FadeIn>
      )}

      {/* ============ FEATURED ============ */}
      {featured.length > 0 && (
        <FadeIn>
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-bold">⭐ Bidhaa Maalum</h2>
              <span className="text-[10px] text-white/40 tracking-widest">{featured.length} BIDHAA</span>
            </div>
            <ProductGrid products={featured} onProduct={onProduct} compact />
          </section>
        </FadeIn>
      )}

      {/* ============ TRENDING ============ */}
      {trending.length > 0 && (
        <FadeIn>
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base md:text-lg font-bold">📈 Zinazouzwa Sana</h2>
              <span className="text-[10px] text-white/40 tracking-widest">{trending.length} BIDHAA</span>
            </div>
            <ProductGrid products={trending} onProduct={onProduct} compact />
          </section>
        </FadeIn>
      )}

      {/* ============ ALL PRODUCTS ============ */}
      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold">Bidhaa Zote</h2>
            <span className="text-[10px] text-white/40 tracking-widest">{PRODUCTS.length} BIDHAA</span>
          </div>
          <ProductGrid products={PRODUCTS} onProduct={onProduct} compact />
        </section>
      </FadeIn>

      {/* ============ TOP SELLERS — compact ============ */}
      <FadeIn>
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold">🏪 Wauzaji Bora</h2>
            <span className="text-[10px] text-white/40 tracking-widest">{SELLERS.length} STORES</span>
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

// ============================================================
// COMPACT PRODUCT GRID — Amazon style
// ============================================================
function ProductGrid({ products, onProduct, emptyText, compact = false }: {
  products: Product[]
  onProduct: (id: string) => void
  emptyText?: string
  compact?: boolean
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
        <FadeIn key={p.id} delay={Math.min(i, 5) * 0.03}>
          <ProductCardCompact product={p} onClick={() => onProduct(p.id)} />
        </FadeIn>
      ))}
    </div>
  )
}

// ============================================================
// PRODUCT CARD — Bright white, compact
// ============================================================
function ProductCardCompact({ product, onClick }: { product: Product; onClick: () => void }) {
  const seller = getSeller(product.sellerId)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <button onClick={onClick} className="group w-full text-left bg-white rounded-lg overflow-hidden hover:shadow-[0_8px_30px_rgba(251,188,5,0.25)] transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square bg-white overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#EA4335] text-white text-[10px] font-bold">
            -{discount}%
          </div>
        )}

        {/* Stock low */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[9px] font-bold text-[#FBBC05]">
            {product.stock} left
          </div>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-[10px] font-bold text-black/70 tracking-wider">IMEISHA</span>
          </div>
        )}
      </div>

      {/* Info — dark text on white */}
      <div className="p-2 md:p-2.5">
        <h3 className="text-[11px] md:text-xs font-medium text-black leading-tight line-clamp-2 min-h-[28px] group-hover:text-[#FF8C00] transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="w-2.5 h-2.5 text-[#FF8C00]" fill="#FF8C00" />
          <span className="text-[9px] text-black/60 font-medium">{product.rating}</span>
          <span className="text-[9px] text-black/30">·</span>
          <span className="text-[9px] text-black/50">{product.soldCount}</span>
        </div>

        <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm md:text-base font-bold text-black">{formatTZS(product.price)}</span>
          {product.oldPrice && (
            <span className="text-[9px] text-black/40 line-through">{formatTZS(product.oldPrice)}</span>
          )}
        </div>

        {seller && (
          <p className="text-[9px] text-black/50 mt-1 truncate">{seller.name}</p>
        )}
      </div>
    </button>
  )
}

// ============================================================
// COMPACT STORE CARD
// ============================================================
function StoreCardCompact({ seller, onClick }: { seller: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-[#FBBC05]/50 transition text-left"
    >
      <div className="flex items-center gap-2 mb-2">
        <img src={seller.logo} alt={seller.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="text-xs font-bold text-white truncate">{seller.name}</h3>
            {seller.verified && <Verified className="w-3 h-3 text-[#4285F4] shrink-0" />}
          </div>
          <div className="flex items-center gap-1 text-[9px] text-white/50 mt-0.5">
            <Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" />
            <span>{seller.rating}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[9px] text-white/40">
        <MapPin className="w-2.5 h-2.5" />
        <span className="truncate">{seller.location}</span>
      </div>
    </button>
  )
}

// ============================================================
// CATEGORY VIEW
// ============================================================
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
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      {/* Category header — bright */}
      <div className="rounded-2xl p-5 md:p-8 text-center"
        style={{ background: `linear-gradient(135deg, ${cat?.color}25 0%, ${cat?.color}10 100%)`, border: `1px solid ${cat?.color}40` }}>
        <div className="text-4xl md:text-6xl mb-3">{cat?.icon}</div>
        <h1 className="text-2xl md:text-4xl font-black mb-1" style={{ color: cat?.color }}>{cat?.name}</h1>
        <p className="text-xs text-white/60">{products.length} bidhaa</p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 focus-within:border-[#FBBC05]/50 transition">
          <Search className="w-4 h-4 text-white/40" />
          <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Tafuta kwenye category..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30" />
        </div>
      </div>

      <ProductGrid products={filtered} onProduct={onProduct} compact />
    </div>
  )
}

// ============================================================
// STORE VIEW
// ============================================================
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
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      {/* Store hero */}
      <div className="relative rounded-2xl overflow-hidden h-40 md:h-56">
        <img src={seller.banner} alt={seller.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000005] via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex items-end gap-3">
          <img src={seller.logo} alt={seller.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-[#000005] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-2xl font-black text-white truncate">{seller.name}</h1>
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

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onChat(seller.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4285F4] hover:bg-[#4285F4]/90 text-white text-xs font-bold tracking-widest transition">
          <MessageSquare className="w-3.5 h-3.5" /> CHAT
        </button>
        <a href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white text-xs font-bold tracking-widest transition">
          WHATSAPP
        </a>
        <a href={`tel:${seller.phone}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold tracking-widest transition">
          <Phone className="w-3.5 h-3.5" /> PIGA SIMU
        </a>
      </div>

      <p className="text-sm text-white/60 max-w-2xl">{seller.description}</p>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base md:text-lg font-bold">Bidhaa ({products.length})</h2>
        </div>
        <ProductGrid products={products} onProduct={onProduct} compact />
      </div>
    </div>
  )
}

// ============================================================
// PRODUCT VIEW
// ============================================================
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
    <div className="space-y-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Images — bright white bg */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-white/10">
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
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition bg-white ${
                    i === imgIndex ? 'border-[#FBBC05]' : 'border-white/10 hover:border-white/30'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {seller && (
            <p className="text-[10px] tracking-[0.3em] text-[#FBBC05] mb-2">{seller.name.toUpperCase()}</p>
          )}

          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-3 leading-tight text-white">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 text-xs text-white/60 mb-5 flex-wrap">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#FBBC05]" fill="#FBBC05" />
              {product.rating} ({product.reviewsCount})
            </span>
            <span>·</span>
            <span>{product.soldCount} zimeuzwa</span>
          </div>

          <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-white/10">
            <span className="text-3xl md:text-4xl font-black text-[#FBBC05]">{formatTZS(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-base text-white/40 line-through">{formatTZS(product.oldPrice)}</span>
                <span className="text-xs font-bold text-white bg-[#EA4335] px-2.5 py-1 rounded">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-5">{product.description}</p>

          <div className="flex items-center gap-2 mb-5">
            <span className={`text-xs font-bold tracking-wider ${product.stock > 0 ? 'text-[#34A853]' : 'text-[#EA4335]'}`}>
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
                <span className="text-base font-bold w-10 text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => onAdd(product.id, qty)}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] hover:opacity-90 text-black font-bold text-sm flex items-center justify-center gap-2 transition">
                <ShoppingCart className="w-4 h-4" /> ONGEZA CART
              </button>
            </div>
          )}

          {seller && (
            <>
              <button
                onClick={() => onChat(seller.id, product.id)}
                className="w-full mb-3 py-3 rounded-full bg-[#4285F4]/15 border border-[#4285F4]/40 hover:bg-[#4285F4]/25 text-sm font-semibold flex items-center justify-center gap-2 transition text-[#8ab4f8]"
              >
                <MessageSquare className="w-4 h-4" /> CHAT NA MUUZAJI
              </button>

              <button onClick={() => onStore(seller.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-left">
                <img src={seller.logo} alt={seller.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-bold text-white truncate">{seller.name}</h3>
                    {seller.verified && <Verified className="w-3.5 h-3.5 text-[#4285F4]" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                    <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" /> {seller.rating}</span>
                    <span>·</span>
                    <span>{seller.location}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/40" />
              </button>
            </>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base md:text-lg font-bold">Bidhaa Zinazofanana</h2>
          </div>
          <ProductGrid products={similar} onProduct={onProduct} compact />
        </div>
      )}
    </div>
  )
}

// ============================================================
// CART VIEW
// ============================================================
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
      <div className="text-center py-16">
        <ShoppingCart className="w-14 h-14 text-white/15 mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-bold mb-2">Cart yako ni tupu</h2>
        <p className="text-sm text-white/50 mb-6">Anza kuongeza bidhaa</p>
        <button onClick={onBack}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm font-bold tracking-widest hover:opacity-90 transition">
          ANZA KUNUNUA
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> ENDELEA KUNUNUA
      </button>

      <div>
        <h1 className="text-2xl md:text-3xl font-black">Cart Yangu ({cart.length})</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {cart.map(({ item, product }) => {
            const seller = getSeller(product.sellerId)
            return (
              <div key={product.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <button onClick={() => onProduct(product.id)} className="shrink-0">
                  <img src={product.images[0]} alt={product.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover border border-white/10 bg-white" />
                </button>
                <div className="flex-1 min-w-0">
                  <button onClick={() => onProduct(product.id)} className="text-left">
                    <h3 className="text-sm font-semibold text-white truncate hover:text-[#FBBC05] transition">{product.name}</h3>
                  </button>
                  {seller && <p className="text-[10px] text-white/50 mt-0.5 truncate">{seller.name}</p>}
                  <p className="text-base font-bold text-[#FBBC05] mt-1">{formatTZS(product.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-black/40 rounded-full p-0.5 border border-white/10">
                      <button onClick={() => onUpdate(product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
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
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 sticky top-4">
            <h2 className="text-xs tracking-widest font-bold mb-4 text-white/60">MUHTASARI</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-white/70"><span>Subtotal</span><span>{formatTZS(subtotal)}</span></div>
              <div className="flex justify-between text-white/70"><span>Delivery</span><span>{formatTZS(deliveryFee)}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                <span className="font-bold">Jumla</span>
                <span className="text-2xl font-black text-[#FBBC05]">{formatTZS(total)}</span>
              </div>
            </div>
            <button onClick={onCheckout}
              className="w-full mt-5 py-3.5 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black font-bold text-sm tracking-widest hover:opacity-90 transition">
              ENDELEA CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CHECKOUT VIEW
// ============================================================
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
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>

      <h1 className="text-2xl md:text-3xl font-black">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <h2 className="text-xs tracking-widest font-bold mb-4 text-white/60 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FBBC05]" /> TAARIFA ZA DELIVERY
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Jina kamili *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Jina lako" />
              <Input label="Simu *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+255 7XX XXX XXX" type="tel" />
              <div className="sm:col-span-2">
                <Input label="Anwani *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Mtaa, nyumba, landmark" />
              </div>
              <Input label="Mji *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Dar es Salaam" />
            </div>
          </div>

          <div className="p-4 md:p-5 rounded-2xl bg-white/[0.04] border border-white/10">
            <h2 className="text-xs tracking-widest font-bold mb-4 text-white/60 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#FBBC05]" /> NJIA YA MALIPO
            </h2>
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <label key={m} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  form.payment === m ? 'bg-[#FBBC05]/10 border-[#FBBC05]/60' : 'border-white/10 hover:bg-white/5'
                }`}>
                  <input type="radio" name="payment" checked={form.payment === m}
                    onChange={() => setForm({ ...form, payment: m })} className="accent-[#FBBC05]" />
                  <span className="text-sm font-semibold">{m}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs text-white/60 mb-1.5 block">Maelezo (si lazima)</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2} placeholder="Maelezo kwa muuzaji..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#FBBC05]/60 outline-none text-sm text-white placeholder-white/30 resize-none" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 sticky top-4">
            <h2 className="text-xs tracking-widest font-bold mb-4">ODA YAKO ({cart.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto scroll-thin mb-3">
              {cart.map(({ item, product }) => (
                <div key={product.id} className="flex items-center gap-2 text-xs">
                  <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-white/10 bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-white/80">{product.name}</p>
                    <p className="text-white/40">{item.quantity} × {formatTZS(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-white/70"><span>Subtotal</span><span>{formatTZS(subtotal)}</span></div>
              <div className="flex justify-between text-white/70"><span>Delivery</span><span>{formatTZS(deliveryFee)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                <span>Jumla</span><span className="text-[#FBBC05]">{formatTZS(total)}</span>
              </div>
            </div>
            <button type="submit"
              className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black font-bold text-sm flex items-center justify-center gap-2">
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
      <label className="text-xs text-white/60 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#FBBC05]/60 outline-none text-sm text-white placeholder-white/30 transition" />
    </div>
  )
}

// ============================================================
// ORDERS VIEW
// ============================================================
function OrdersView({ orders, onBack }: { orders: Order[]; onBack: () => void }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-14 h-14 text-white/15 mx-auto mb-4" />
        <h2 className="text-xl md:text-2xl font-bold mb-2">Hauna oda bado</h2>
        <button onClick={onBack} className="mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm font-bold tracking-widest">
          ANZA KUNUNUA
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs tracking-widest text-white/50 hover:text-[#FBBC05] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> RUDI
      </button>
      <h1 className="text-2xl md:text-3xl font-black">Oda Zangu</h1>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <p className="text-[10px] tracking-widest text-white/40">ODA #{o.id}</p>
                <p className="text-xs text-white/60">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FBBC05]/20 text-[#FBBC05] border border-[#FBBC05]/40">
                {o.status.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2 mb-3">
              {o.items.map((it, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <img src={it.image} alt="" className="w-10 h-10 rounded object-cover border border-white/10 bg-white" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-white/80">{it.name}</p>
                    <p className="text-white/40">{it.quantity} × {formatTZS(it.price)} · {it.sellerName}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/60">{o.paymentMethod}</span>
              <span className="text-base font-bold text-[#FBBC05]">{formatTZS(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// SUCCESS VIEW
// ============================================================
function SuccessView({ order, onHome, onOrders }: { order: Order; onHome: () => void; onOrders: () => void }) {
  return (
    <div className="text-center py-12 max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-[#34A853] flex items-center justify-center mx-auto mb-5"
      >
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </motion.div>
      <h1 className="text-2xl md:text-3xl font-black mb-2">Oda Imewekwa!</h1>
      <p className="text-sm text-white/60 mb-5">Asante kwa kununua kupitia M Mall</p>

      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 text-left">
        <p className="text-[10px] tracking-widest text-white/40 mb-1">ODA ID</p>
        <p className="text-sm font-mono font-bold text-[#FBBC05] mb-3">{order.id}</p>
        <p className="text-[10px] tracking-widest text-white/40 mb-1">JUMLA</p>
        <p className="text-2xl font-black text-white mb-3">{formatTZS(order.total)}</p>
        <p className="text-xs text-white/60">
          Muuzaji atawasiliana nawe kwa <b className="text-white/80">{order.customerPhone}</b> kuhusu delivery na malipo.
        </p>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={onHome} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold tracking-widest">
          ENDELEA KUNUNUA
        </button>
        <button onClick={onOrders} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FBBC05] to-[#FF8C00] text-black text-sm font-bold tracking-widest">
          ODA ZANGU
        </button>
      </div>
    </div>
  )
}
