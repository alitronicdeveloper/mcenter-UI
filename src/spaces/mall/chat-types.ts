export type ChatMessage = {
  id: string
  threadId: string
  from: 'customer' | 'seller'
  text: string
  timestamp: number
  read: boolean
}

export type ChatThread = {
  id: string
  customerName: string
  customerPhone: string
  sellerId: string
  productId?: string       // product context (optional)
  messages: ChatMessage[]
  createdAt: number
  lastMessageAt: number
  unreadBySeller: number
  unreadByCustomer: number
}
