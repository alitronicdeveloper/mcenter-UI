import { create } from 'zustand'
import type { Product, Order, Seller } from '../mall/types'
import { PRODUCTS, SELLERS } from '../mall/data'

const PRODUCTS_KEY = 'mcenter:sales-products'
const ORDERS_KEY = 'mcenter:sales-orders'

const loadProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return PRODUCTS
}

const loadOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  // Mock orders kwa demo
  return [
    {
      id: 'MC-DEMO01', customerName: 'Juma Mwinyi', customerPhone: '+255 712 000 111',
      address: 'Kinondoni', city: 'Dar es Salaam', paymentMethod: 'M-Pesa',
      subtotal: 780000, deliveryFee: 10000, total: 790000, status: 'paid',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      items: [
        { productId: 'p1', name: 'Samsung Galaxy A54 5G', price: 780000, quantity: 1,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
          sellerName: 'TechHub TZ' },
      ],
    },
    {
      id: 'MC-DEMO02', customerName: 'Amina Hassan', customerPhone: '+255 754 222 333',
      address: 'Kariakoo', city: 'Dar es Salaam', paymentMethod: 'Tigo Pesa',
      subtotal: 850000, deliveryFee: 10000, total: 860000, status: 'shipped',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      items: [
        { productId: 'p3', name: 'Sony WH-1000XM5 Headphones', price: 850000, quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e062b05ebeb?w=600',
          sellerName: 'TechHub TZ' },
      ],
    },
    {
      id: 'MC-DEMO03', customerName: 'Rashid Ali', customerPhone: '+255 786 444 555',
      address: 'Mikocheni', city: 'Dar es Salaam', paymentMethod: 'Airtel Money',
      subtotal: 1560000, deliveryFee: 10000, total: 1570000, status: 'delivered',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      items: [
        { productId: 'p1', name: 'Samsung Galaxy A54 5G', price: 780000, quantity: 2,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600',
          sellerName: 'TechHub TZ' },
      ],
    },
  ]
}

const saveProducts = (p: Product[]) => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(p))
const saveOrders = (o: Order[]) => localStorage.setItem(ORDERS_KEY, JSON.stringify(o))

type State = {
  // Seller aliye-login (mock: tunatumia TechHub TZ kama default)
  currentSellerId: string
  setCurrentSellerId: (id: string) => void

  products: Product[]
  orders: Order[]

  addProduct: (p: Product) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void

  updateOrderStatus: (id: string, status: Order['status']) => void

  resetAll: () => void
}

export const useSalesStore = create<State>((set, get) => ({
  currentSellerId: 's1',
  setCurrentSellerId: (id) => set({ currentSellerId: id }),

  products: loadProducts(),
  orders: loadOrders(),

  addProduct: (p) => {
    const next = [p, ...get().products]
    saveProducts(next)
    set({ products: next })
  },
  updateProduct: (id, patch) => {
    const next = get().products.map((p) => (p.id === id ? { ...p, ...patch } : p))
    saveProducts(next)
    set({ products: next })
  },
  deleteProduct: (id) => {
    const next = get().products.filter((p) => p.id !== id)
    saveProducts(next)
    set({ products: next })
  },

  updateOrderStatus: (id, status) => {
    const next = get().orders.map((o) => (o.id === id ? { ...o, status } : o))
    saveOrders(next)
    set({ orders: next })
  },

  resetAll: () => {
    saveProducts(PRODUCTS)
    saveOrders([])
    set({ products: PRODUCTS, orders: [] })
  },
}))

// Helper: seller aliye-login
export const useCurrentSeller = (): Seller | undefined => {
  const id = useSalesStore((s) => s.currentSellerId)
  return SELLERS.find((s) => s.id === id)
}
