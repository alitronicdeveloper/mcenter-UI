import { create } from 'zustand'
import type { ChatMessage, ChatThread } from './chat-types'

const KEY = 'mcenter:mchat-threads'
const CUSTOMER_KEY = 'mcenter:mchat-customer'

type Customer = { name: string; phone: string }

const loadThreads = (): ChatThread[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
const saveThreads = (t: ChatThread[]) => localStorage.setItem(KEY, JSON.stringify(t))

const loadCustomer = (): Customer | null => {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
const saveCustomer = (c: Customer) => localStorage.setItem(CUSTOMER_KEY, JSON.stringify(c))

type State = {
  customer: Customer | null
  setCustomer: (c: Customer) => void

  threads: ChatThread[]
  activeThreadId: string | null
  setActiveThreadId: (id: string | null) => void

  // UI State — kwa panel
  isOpen: boolean
  activeSellerId: string | null
  activeProductId: string | undefined
  openChat: (sellerId: string, productId?: string) => void
  closeChat: () => void

  getThread: (id: string) => ChatThread | undefined
  findThread: (sellerId: string, productId?: string) => ChatThread | undefined

  startThread: (sellerId: string, productId?: string, initialText?: string) => string
  sendMessage: (threadId: string, text: string, from: 'customer' | 'seller') => void
  markReadBySeller: (threadId: string) => void
  markReadByCustomer: (threadId: string) => void
  autoReplyFromSeller: (threadId: string, sellerName: string) => void
}

export const useChatStore = create<State>((set, get) => ({
  customer: loadCustomer(),
  setCustomer: (c) => { saveCustomer(c); set({ customer: c }) },

  threads: loadThreads(),
  activeThreadId: null,
  setActiveThreadId: (id) => set({ activeThreadId: id }),

  isOpen: false,
  activeSellerId: null,
  activeProductId: undefined,
  openChat: (sellerId, productId) => {
    set({ isOpen: true, activeSellerId: sellerId, activeProductId: productId })
  },
  closeChat: () => {
    set({ isOpen: false, activeSellerId: null, activeProductId: undefined })
  },

  getThread: (id) => get().threads.find((t) => t.id === id),

  findThread: (sellerId, productId) => {
    const { customer, threads } = get()
    if (!customer) return undefined
    return threads.find(
      (t) =>
        t.sellerId === sellerId &&
        t.customerPhone === customer.phone &&
        (productId === undefined || t.productId === productId)
    )
  },

  startThread: (sellerId, productId, initialText) => {
    let { customer } = get()
    if (!customer) {
      customer = { name: 'Mteja', phone: '+255 000 000 000' }
      saveCustomer(customer)
      set({ customer })
    }
    const id = 'th-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
    const now = Date.now()
    const newThread: ChatThread = {
      id,
      customerName: customer.name,
      customerPhone: customer.phone,
      sellerId,
      productId,
      messages: initialText
        ? [{
            id: 'm-' + Date.now().toString(36),
            threadId: id,
            from: 'customer',
            text: initialText,
            timestamp: now,
            read: false,
          }]
        : [],
      createdAt: now,
      lastMessageAt: now,
      unreadBySeller: initialText ? 1 : 0,
      unreadByCustomer: 0,
    }
    const next = [newThread, ...get().threads]
    saveThreads(next)
    set({ threads: next })
    return id
  },

  sendMessage: (threadId, text, from) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const now = Date.now()
    const msg: ChatMessage = {
      id: 'm-' + now.toString(36) + Math.random().toString(36).slice(2, 5),
      threadId,
      from,
      text: trimmed,
      timestamp: now,
      read: false,
    }
    const next = get().threads.map((t) => {
      if (t.id !== threadId) return t
      return {
        ...t,
        messages: [...t.messages, msg],
        lastMessageAt: now,
        unreadBySeller: from === 'customer' ? t.unreadBySeller + 1 : t.unreadBySeller,
        unreadByCustomer: from === 'seller' ? t.unreadByCustomer + 1 : t.unreadByCustomer,
      }
    })
    saveThreads(next)
    set({ threads: next })
  },

  markReadBySeller: (threadId) => {
    const next = get().threads.map((t) =>
      t.id === threadId
        ? { ...t, unreadBySeller: 0, messages: t.messages.map((m) => ({ ...m, read: true })) }
        : t
    )
    saveThreads(next)
    set({ threads: next })
  },

  markReadByCustomer: (threadId) => {
    const next = get().threads.map((t) =>
      t.id === threadId ? { ...t, unreadByCustomer: 0 } : t
    )
    saveThreads(next)
    set({ threads: next })
  },

  autoReplyFromSeller: (threadId, sellerName) => {
    const replies = [
      `Karibu! Asante kwa kuwasiliana na ${sellerName}. Bidhaa ipo tayari.`,
      `Bei ni fixed lakini tunaweza kujadili kwa wingi.`,
      `Delivery inafanyika kwa siku 1-3 Tanzania nzima.`,
      `Unaweza kulipa kwa M-Pesa, Tigo, Airtel, au Cash on delivery.`,
      `Kama una swali zaidi, tuambie. Karibu tena!`,
    ]
    const text = replies[Math.floor(Math.random() * replies.length)]
    setTimeout(() => {
      get().sendMessage(threadId, text, 'seller')
    }, 1500 + Math.random() * 1500)
  },
}))
