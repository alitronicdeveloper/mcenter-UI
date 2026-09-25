import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Settings,
  Plus, Edit, Trash2, X, Check, TrendingUp, DollarSign,
  Star, MapPin, Phone, Search, ChevronDown, AlertCircle, CheckCircle2,
  Clock, Truck, XCircle, Save, Send, ArrowLeft, MessageSquare,
} from 'lucide-react'
import type { Product, Order, Seller } from './mall/types'
import { CATEGORIES, formatTZS, SELLERS } from './mall/data'
import { useSalesStore, useCurrentSeller } from './sales/store'
import { useChatStore } from './mall/chat-store'

type SalesView = 'dashboard' | 'products' | 'orders' | 'customers' | 'reports' | 'settings' | 'messages'

export default function SalesSpace() {
  const [view, setView] = useState<SalesView>('dashboard')
  const seller = useCurrentSeller()

  const navItems: { id: SalesView; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'products',  label: 'Products',   icon: Package },
    { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
    { id: 'messages',  label: 'Messages',   icon: MessageSquare },
    { id: 'customers', label: 'Customers',  icon: Users },
    { id: 'reports',   label: 'Reports',    icon: BarChart3 },
    { id: 'settings',  label: 'Store',      icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <SellerTopBar seller={seller} />

      <div className="grid lg:grid-cols-[220px_1fr] gap-5 mt-4">
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar p-2 rounded-xl bg-white/5 border border-white/10">
            {navItems.map((n) => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition ${
                  view === n.id
                    ? 'bg-[#34A853]/20 text-[#34A853] border border-[#34A853]/40'
                    : 'text-white/60 hover:bg-white/5'
                }`}
              >
                <n.icon className="w-3.5 h-3.5" />
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {view === 'dashboard' && <DashboardView />}
              {view === 'products'  && <ProductsView />}
              {view === 'orders'    && <OrdersView />}
              {view === 'messages'  && <MessagesView />}
              {view === 'customers' && <CustomersView />}
              {view === 'reports'   && <ReportsView />}
              {view === 'settings'  && <SettingsView seller={seller} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

function SellerTopBar({ seller }: { seller: Seller | undefined }) {
  const { currentSellerId, setCurrentSellerId } = useSalesStore()
  const [open, setOpen] = useState(false)

  if (!seller) return null

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <img src={seller.logo} alt={seller.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold text-white truncate">{seller.name}</h2>
          {seller.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#4285F4] shrink-0" />}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
          <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" /> {seller.rating}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {seller.location}</span>
        </div>
      </div>

      <div className="relative">
        <button onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] text-white/70 transition">
          Switch <ChevronDown className="w-3 h-3" />
        </button>
        <AnimatePresence>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-full right-0 mt-1.5 w-56 max-h-72 overflow-y-auto scroll-thin rounded-xl bg-[#0a0a14]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
              >
                {SELLERS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setCurrentSellerId(s.id); setOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-white/5 transition ${
                      s.id === currentSellerId ? 'bg-[#34A853]/20 text-[#34A853]' : 'text-white/80'
                    }`}
                  >
                    <img src={s.logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span className="flex-1 truncate">{s.name}</span>
                    {s.id === currentSellerId && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function DashboardView() {
  const { products, orders, currentSellerId } = useSalesStore()
  const seller = useCurrentSeller()

  const myProducts = useMemo(
    () => products.filter((p) => p.sellerId === currentSellerId),
    [products, currentSellerId]
  )
  const myOrders = useMemo(
    () => orders.filter((o) => o.items.some((it) => myProducts.some((p) => p.id === it.productId))),
    [orders, myProducts]
  )

  const totalRevenue = myOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0)
  const pendingOrders = myOrders.filter((o) => o.status === 'pending').length
  const lowStock = myProducts.filter((p) => p.stock > 0 && p.stock < 5).length
  const outOfStock = myProducts.filter((p) => p.stock === 0).length

  const stats = [
    { label: 'Revenue', value: formatTZS(totalRevenue), icon: DollarSign, color: '#34A853', sub: 'Oda zote zilizolipwa' },
    { label: 'Orders', value: myOrders.length.toString(), icon: ShoppingBag, color: '#4285F4', sub: `${pendingOrders} mpya` },
    { label: 'Products', value: myProducts.length.toString(), icon: Package, color: '#FBBC05', sub: `${lowStock} stock ndogo` },
    { label: 'Customers', value: new Set(myOrders.map((o) => o.customerPhone)).size.toString(), icon: Users, color: '#A855F7', sub: 'Wateja wa kipekee' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-black">Karibu, {seller?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-xs text-white/50 mt-1">Hapa ni muhtasari wa biashara yako</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10"
            style={{ borderColor: `${s.color}22` }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `${s.color}22`, border: `1px solid ${s.color}44` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-lg md:text-2xl font-black text-white">{s.value}</div>
            <div className="text-[10px] md:text-xs text-white/60 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {(lowStock > 0 || outOfStock > 0) && (
        <div className="p-3 rounded-xl bg-[#FBBC05]/10 border border-[#FBBC05]/40 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#FBBC05] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-white">Angalizo la stock</p>
            <p className="text-white/60 mt-0.5">
              {outOfStock > 0 && `${outOfStock} bidhaa zimeisha. `}
              {lowStock > 0 && `${lowStock} zina stock ndogo (<5). `}
              Nenda kwenye <b className="text-[#FBBC05]">Products</b> kuongeza.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Oda za Hivi Karibuni</h2>
          <span className="text-[10px] text-white/40">{myOrders.length} jumla</span>
        </div>
        {myOrders.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="Hakuna oda bado" desc="Oda mpya zitaonekana hapa" />
        ) : (
          <div className="space-y-2">
            {myOrders.slice(0, 5).map((o) => <OrderRow key={o.id} order={o} compact />)}
          </div>
        )}
      </div>

      {lowStock + outOfStock > 0 && (
        <div>
          <h2 className="text-base font-bold mb-3">Bidhaa Zinazohitaji Uangalizi</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {myProducts.filter((p) => p.stock < 5).slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 border border-white/10">
                <img src={p.images[0]} alt="" className="w-12 h-12 rounded object-cover border border-white/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-white/50">{formatTZS(p.price)}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  p.stock === 0 ? 'bg-[#EA4335]/20 text-[#EA4335]' : 'bg-[#FBBC05]/20 text-[#FBBC05]'
                }`}>
                  {p.stock === 0 ? 'Imeisha' : `${p.stock} zimebaki`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct, currentSellerId } = useSalesStore()
  const myProducts = products.filter((p) => p.sellerId === currentSellerId)

  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = myProducts
    .filter((p) => catFilter === 'all' || p.category === catFilter)
    .filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

  const openNew = () => { setEditing(null); setShowForm(true) }
  const openEdit = (p: Product) => { setEditing(p); setShowForm(true) }
  const close = () => { setShowForm(false); setEditing(null) }

  const handleSave = (data: Partial<Product>) => {
    if (editing) {
      updateProduct(editing.id, data)
    } else {
      const newProduct: Product = {
        id: 'p' + Date.now().toString(36),
        sellerId: currentSellerId,
        name: data.name || 'Untitled',
        description: data.description || '',
        price: data.price || 0,
        oldPrice: data.oldPrice,
        stock: data.stock || 0,
        images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'],
        category: data.category || 'electronics',
        subcategory: data.subcategory || '',
        rating: 0,
        reviewsCount: 0,
        soldCount: 0,
        tags: data.tags || [],
        createdAt: new Date().toISOString().split('T')[0],
      }
      addProduct(newProduct)
    }
    close()
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    setConfirmDelete(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-black">Bidhaa Zangu</h1>
          <p className="text-xs text-white/50 mt-0.5">{myProducts.length} bidhaa kwenye duka lako</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#34A853] hover:bg-[#34A853]/90 text-white text-xs font-bold transition">
          <Plus className="w-3.5 h-3.5" /> Ongeza Bidhaa
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tafuta bidhaa..."
            className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/40" />
        </div>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white outline-none">
          <option value="all" className="bg-[#0a0a14]">Category zote</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id} className="bg-[#0a0a14]">{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="Hakuna bidhaa" desc="Anza kuongeza bidhaa yako ya kwanza" cta={{ label: 'Ongeza Bidhaa', onClick: openNew }} />
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <img src={p.images[0]} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border border-white/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{p.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-white/50 mt-0.5">
                  <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-[#FBBC05]" fill="#FBBC05" /> {p.rating}</span>
                  <span>•</span>
                  <span>{p.soldCount} zimeuzwa</span>
                  <span>•</span>
                  <span className={`${p.stock === 0 ? 'text-[#EA4335]' : p.stock < 5 ? 'text-[#FBBC05]' : 'text-[#34A853]'}`}>
                    Stock: {p.stock}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#FBBC05]">{formatTZS(p.price)}</span>
                  {p.oldPrice && <span className="text-[10px] text-white/40 line-through">{formatTZS(p.oldPrice)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(p)} title="Badilisha"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition">
                  <Edit className="w-3.5 h-3.5 text-white/70" />
                </button>
                <button onClick={() => setConfirmDelete(p.id)} title="Futa"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 flex items-center justify-center transition">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ProductForm editing={editing} onSave={handleSave} onClose={close} />
        )}
        {confirmDelete && (
          <ConfirmDialog
            title="Futa bidhaa?"
            desc="Kitendo hiki hakiwezi kurudishwa. Bidhaa itatoweka kwenye M Mall mara moja."
            onConfirm={() => handleDelete(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductForm({ editing, onSave, onClose }: {
  editing: Product | null
  onSave: (data: Partial<Product>) => void
  onClose: () => void
}) {
  const [form, setForm] = useState({
    name: editing?.name || '',
    description: editing?.description || '',
    price: editing?.price?.toString() || '',
    oldPrice: editing?.oldPrice?.toString() || '',
    stock: editing?.stock?.toString() || '',
    category: editing?.category || 'electronics',
    subcategory: editing?.subcategory || '',
    images: editing?.images?.join('\n') || '',
    tags: editing?.tags?.join(', ') || '',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      alert('Jaza jina na bei')
      return
    }
    onSave({
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock) || 0,
      category: form.category,
      subcategory: form.subcategory,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-3 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-8 rounded-2xl bg-[#0a0a14] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#34A853]" />
            <h2 className="text-sm font-bold">{editing ? 'Badilisha Bidhaa' : 'Ongeza Bidhaa Mpya'}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto scroll-thin">
          <Field label="Jina la bidhaa *">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Mfano: Samsung Galaxy A54"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>

          <Field label="Maelezo">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Maelezo mafupi ya bidhaa..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm resize-none" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Bei (TZS) *">
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="780000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
            </Field>
            <Field label="Bei ya awali (kwa discount)">
              <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                placeholder="900000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
            </Field>
            <Field label="Stock">
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="15"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id} className="bg-[#0a0a14]">{c.name}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Subcategory">
            <input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
              placeholder="Mfano: Smartphones"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>

          <Field label="Picha (URL, moja kwa mstari)">
            <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
              rows={2} placeholder="https://...jpg&#10;https://...jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-xs font-mono resize-none" />
            <p className="text-[10px] text-white/40 mt-1">Kama huweki URL, tutatumia picha ya default.</p>
          </Field>

          <Field label="Tags (comma-separated)">
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="samsung, 5g, android"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>

          {form.images && (
            <div>
              <p className="text-xs text-white/60 mb-1.5">Preview</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {form.images.split('\n').map((u, i) => u.trim() && (
                  <img key={i} src={u.trim()} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0" />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">
              Ghairi
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#34A853] hover:bg-[#34A853]/90 text-white text-sm font-bold transition flex items-center justify-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              {editing ? 'Hifadhi' : 'Ongeza'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function OrdersView() {
  const { orders, products, updateOrderStatus, currentSellerId } = useSalesStore()
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all')

  const myProductIds = products.filter((p) => p.sellerId === currentSellerId).map((p) => p.id)
  const myOrders = orders.filter((o) => o.items.some((it) => myProductIds.includes(it.productId)))

  const filtered = statusFilter === 'all' ? myOrders : myOrders.filter((o) => o.status === statusFilter)

  const statuses: { id: 'all' | Order['status']; label: string; color: string }[] = [
    { id: 'all',       label: 'Zote',      color: '#ffffff' },
    { id: 'pending',   label: 'Mpya',      color: '#FBBC05' },
    { id: 'paid',      label: 'Zilizolipwa', color: '#4285F4' },
    { id: 'shipped',   label: 'Zimesafirishwa', color: '#A855F7' },
    { id: 'delivered', label: 'Zilizofika', color: '#34A853' },
    { id: 'cancelled', label: 'Zilizofutwa', color: '#EA4335' },
  ]

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-black mb-1">Oda Zangu</h1>
      <p className="text-xs text-white/50 mb-4">{myOrders.length} oda jumla</p>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
        {statuses.map((s) => {
          const count = s.id === 'all' ? myOrders.length : myOrders.filter((o) => o.status === s.id).length
          return (
            <button key={s.id} onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap transition border ${
                statusFilter === s.id
                  ? 'text-white font-semibold'
                  : 'text-white/60 border-white/10 hover:bg-white/5'
              }`}
              style={statusFilter === s.id ? {
                background: `${s.color}22`, borderColor: `${s.color}66`,
              } : {}}>
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Hakuna oda" desc="Oda mpya kutoka M Mall zitaonekana hapa" />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => <OrderRow key={o.id} order={o} onUpdateStatus={updateOrderStatus} />)}
        </div>
      )}
    </div>
  )
}

function OrderRow({ order, compact, onUpdateStatus }: {
  order: Order
  compact?: boolean
  onUpdateStatus?: (id: string, s: Order['status']) => void
}) {
  const statusConfig: Record<Order['status'], { color: string; icon: any; label: string }> = {
    pending:   { color: '#FBBC05', icon: Clock,        label: 'Mpya' },
    paid:      { color: '#4285F4', icon: Check,        label: 'Imelipwa' },
    shipped:   { color: '#A855F7', icon: Truck,        label: 'Inasafiri' },
    delivered: { color: '#34A853', icon: CheckCircle2, label: 'Imefika' },
    cancelled: { color: '#EA4335', icon: XCircle,      label: 'Imefutwa' },
  }
  const cfg = statusConfig[order.status]
  const Icon = cfg.icon

  const nextStatus: Record<Order['status'], Order['status'] | null> = {
    pending:   'paid',
    paid:      'shipped',
    shipped:   'delivered',
    delivered: null,
    cancelled: null,
  }
  const next = nextStatus[order.status]

  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40">#{order.id}</span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1"
            style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}>
            <Icon className="w-2.5 h-2.5" /> {cfg.label}
          </span>
        </div>
        <span className="text-[10px] text-white/40">{new Date(order.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold shrink-0">
          {order.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">{order.customerName}</p>
          <p className="text-[10px] text-white/50">{order.customerPhone} • {order.city}</p>
        </div>
        <span className="text-sm font-bold text-[#FBBC05]">{formatTZS(order.total)}</span>
      </div>

      {!compact && (
        <div className="space-y-1.5 mb-3 pl-10">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <img src={it.image} alt="" className="w-8 h-8 rounded object-cover border border-white/10" />
              <span className="flex-1 text-white/70 truncate">{it.name}</span>
              <span className="text-white/50">×{it.quantity}</span>
            </div>
          ))}
        </div>
      )}

      {!compact && onUpdateStatus && next && (
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <button onClick={() => onUpdateStatus(order.id, next)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition"
            style={{ background: `${statusConfig[next].color}22`, color: statusConfig[next].color, border: `1px solid ${statusConfig[next].color}44` }}>
            Weka kama {statusConfig[next].label}
          </button>
          <button onClick={() => onUpdateStatus(order.id, 'cancelled')}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition">
            Futa
          </button>
        </div>
      )}
    </div>
  )
}

function MessagesView() {
  const { currentSellerId } = useSalesStore()
  const { threads, sendMessage, markReadBySeller } = useChatStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const myThreads = useMemo(
    () => threads.filter((t) => t.sellerId === currentSellerId).sort((a, b) => b.lastMessageAt - a.lastMessageAt),
    [threads, currentSellerId]
  )
  const active = myThreads.find((t) => t.id === activeId)

  useEffect(() => {
    if (activeId) markReadBySeller(activeId)
  }, [activeId, active?.messages.length, markReadBySeller])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [active?.messages.length])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeId || !text.trim()) return
    sendMessage(activeId, text, 'seller')
    setText('')
  }

  if (myThreads.length === 0) {
    return (
      <div>
        <h1 className="text-xl md:text-2xl font-black mb-4">Messages</h1>
        <EmptyState icon={MessageSquare} title="Hakuna messages" desc="Wateja wataanza kuwasiliana nawe hapa" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-black mb-1">Messages</h1>
      <p className="text-xs text-white/50 mb-4">{myThreads.length} mazungumzo</p>

      <div className="grid md:grid-cols-[260px_1fr] gap-3 md:gap-5 h-[65vh]">
        <div className={`overflow-y-auto scroll-thin space-y-1 rounded-xl bg-white/5 border border-white/10 p-2 ${active ? 'hidden md:block' : ''}`}>
          {myThreads.map((t) => {
            const lastMsg = t.messages[t.messages.length - 1]
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full text-left p-2.5 rounded-lg transition ${
                  activeId === t.id ? 'bg-[#34A853]/15 border border-[#34A853]/40' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34A853] to-[#4285F4] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {t.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-white truncate">{t.customerName}</p>
                      {t.unreadBySeller > 0 && (
                        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-[#EA4335] text-white text-[9px] font-bold">
                          {t.unreadBySeller}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/50 truncate">{lastMsg?.text || 'Anza mazungumzo'}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {active ? (
          <div className="flex flex-col rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-white/10 shrink-0">
              <button onClick={() => setActiveId(null)} className="md:hidden w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34A853] to-[#4285F4] flex items-center justify-center text-[10px] font-bold">
                {active.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{active.customerName}</p>
                <p className="text-[10px] text-white/50">{active.customerPhone}</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin p-3 space-y-2">
              {active.messages.map((m) => {
                const isMe = m.from === 'seller'
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMe ? 'bg-[#34A853] text-white rounded-br-sm' : 'bg-white/10 text-white/90 rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <p className={`text-[9px] mt-0.5 ${isMe ? 'text-white/70' : 'text-white/40'}`}>
                        {new Date(m.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <form onSubmit={submit} className="p-3 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 border border-white/10 focus-within:border-[#34A853]/60">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Jibu mteja..."
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
                />
                <button type="submit" disabled={!text.trim()}
                  className="w-8 h-8 rounded-full bg-[#34A853] hover:bg-[#34A853]/90 disabled:opacity-30 flex items-center justify-center shrink-0">
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm">
            Chagua mazungumzo
          </div>
        )}
      </div>
    </div>
  )
}

function CustomersView() {
  const { orders, products, currentSellerId } = useSalesStore()
  const myProductIds = products.filter((p) => p.sellerId === currentSellerId).map((p) => p.id)
  const myOrders = orders.filter((o) => o.items.some((it) => myProductIds.includes(it.productId)))

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; city: string; orders: number; spent: number; lastOrder: string }>()
    myOrders.forEach((o) => {
      const key = o.customerPhone
      const existing = map.get(key)
      if (existing) {
        existing.orders += 1
        existing.spent += o.total
        if (o.createdAt > existing.lastOrder) existing.lastOrder = o.createdAt
      } else {
        map.set(key, {
          name: o.customerName,
          phone: o.customerPhone,
          city: o.city,
          orders: 1,
          spent: o.total,
          lastOrder: o.createdAt,
        })
      }
    })
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent)
  }, [myOrders])

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-black mb-1">Wateja Wangu</h1>
      <p className="text-xs text-white/50 mb-4">{customers.length} wateja wa kipekee</p>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="Hakuna wateja bado" desc="Wateja wataonekana hapa wanapofanya oda" />
      ) : (
        <div className="space-y-2">
          {customers.map((c) => (
            <div key={c.phone} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34A853] to-[#4285F4] flex items-center justify-center text-sm font-bold shrink-0">
                {c.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                <p className="text-[10px] text-white/50 truncate">{c.phone} • {c.city}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#FBBC05]">{formatTZS(c.spent)}</p>
                <p className="text-[10px] text-white/40">{c.orders} oda</p>
              </div>
              <a href={`tel:${c.phone}`}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition shrink-0">
                <Phone className="w-3.5 h-3.5 text-[#34A853]" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReportsView() {
  const { orders, products, currentSellerId } = useSalesStore()
  const myProducts = products.filter((p) => p.sellerId === currentSellerId)
  const myOrders = orders.filter((o) => o.items.some((it) => myProducts.some((p) => p.id === it.productId)))

  const salesByProduct = useMemo(() => {
    const map = new Map<string, { name: string; sold: number; revenue: number; image: string }>()
    myOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!myProducts.some((p) => p.id === it.productId)) return
        const existing = map.get(it.productId)
        if (existing) {
          existing.sold += it.quantity
          existing.revenue += it.price * it.quantity
        } else {
          map.set(it.productId, {
            name: it.name, sold: it.quantity, revenue: it.price * it.quantity, image: it.image,
          })
        }
      })
    })
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [myOrders, myProducts])

  const totalRevenue = myOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const totalSold = myOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.items.reduce((ss, it) => ss + it.quantity, 0), 0)
  const avgOrder = myOrders.length > 0 ? totalRevenue / myOrders.length : 0

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-black">Ripoti</h1>
        <p className="text-xs text-white/50 mt-0.5">Muhtasari wa biashara yako</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-white/50 mb-1">Revenue</div>
          <div className="text-base md:text-xl font-black text-[#34A853]">{formatTZS(totalRevenue)}</div>
        </div>
        <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-white/50 mb-1">Bidhaa zimeuzwa</div>
          <div className="text-base md:text-xl font-black text-[#4285F4]">{totalSold}</div>
        </div>
        <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-white/50 mb-1">Avg Order</div>
          <div className="text-base md:text-xl font-black text-[#FBBC05]">{formatTZS(Math.round(avgOrder))}</div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FBBC05]" /> Top Bidhaa
        </h2>
        {salesByProduct.length === 0 ? (
          <EmptyState icon={BarChart3} title="Hakuna data" desc="Bado hakuna mauzo" />
        ) : (
          <div className="space-y-2">
            {salesByProduct.map((p, i) => {
              const maxRev = salesByProduct[0]?.revenue || 1
              const pct = (p.revenue / maxRev) * 100
              return (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#34A853]/20 text-[#34A853] text-[10px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                    <img src={p.image} alt="" className="w-10 h-10 rounded object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-white/50">{p.sold} zimeuzwa</p>
                    </div>
                    <span className="text-xs font-bold text-[#FBBC05]">{formatTZS(p.revenue)}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#34A853] to-[#4285F4] transition-all"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsView({ seller }: { seller: Seller | undefined }) {
  const [form, setForm] = useState({
    name: seller?.name || '',
    description: seller?.description || '',
    location: seller?.location || '',
    phone: seller?.phone || '',
    whatsapp: seller?.whatsapp || '',
    logo: seller?.logo || '',
    banner: seller?.banner || '',
  })

  if (!seller) return null

  const save = () => alert('✓ Taarifa zimehifadhiwa (mock). Baadaye tutaunganisha na database halisi.')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl md:text-2xl font-black">Mipangilio ya Duka</h1>
        <p className="text-xs text-white/50 mt-0.5">Taarifa zinazoonekana kwa wateja M Mall</p>
      </div>

      <div className="relative rounded-2xl overflow-hidden">
        <img src={form.banner} alt="" className="w-full h-32 md:h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <img src={form.logo} alt="" className="w-16 h-16 rounded-full border-4 border-[#000005]" />
          <div>
            <h2 className="text-lg font-black text-white">{form.name}</h2>
            <p className="text-xs text-white/60">{form.location}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <Field label="Jina la duka">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
        </Field>
        <Field label="Maelezo">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm resize-none" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Location">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>
          <Field label="Simu">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>
          <Field label="WhatsApp (bila +)">
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-sm" />
          </Field>
          <Field label="Logo (URL)">
            <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-xs font-mono" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Banner (URL)">
              <input value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#34A853]/60 outline-none text-xs font-mono" />
            </Field>
          </div>
        </div>
        <button onClick={save}
          className="w-full py-3 rounded-xl bg-[#34A853] hover:bg-[#34A853]/90 text-white text-sm font-bold transition flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Hifadhi Mabadiliko
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-white/60 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function EmptyState({ icon: Icon, title, desc, cta }: {
  icon: any; title: string; desc: string; cta?: { label: string; onClick: () => void }
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-white/15 mx-auto mb-3" />
      <h3 className="text-sm font-bold text-white/70">{title}</h3>
      <p className="text-xs text-white/40 mt-1">{desc}</p>
      {cta && (
        <button onClick={cta.onClick}
          className="mt-4 px-4 py-2 rounded-full bg-[#34A853] text-white text-xs font-bold hover:opacity-90 transition">
          {cta.label}
        </button>
      )}
    </div>
  )
}

function ConfirmDialog({ title, desc, onConfirm, onCancel }: {
  title: string; desc: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[#0a0a14] border border-white/10 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
        <p className="text-xs text-white/60 mb-5">{desc}</p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs transition">
            Ghairi
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition">
            Futa
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
