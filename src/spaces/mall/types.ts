export type Seller = {
  id: string
  name: string
  logo: string
  banner: string
  description: string
  location: string
  rating: number
  reviews: number
  followers: number
  verified: boolean
  joinedAt: string
  phone: string
  whatsapp: string
}

export type Product = {
  id: string
  sellerId: string
  name: string
  description: string
  price: number
  oldPrice?: number
  stock: number
  images: string[]
  category: string
  subcategory: string
  rating: number
  reviewsCount: number
  soldCount: number
  tags: string[]
  createdAt: string
  featured?: boolean
  trending?: boolean
}

export type CartItem = {
  productId: string
  quantity: number
}

export type Order = {
  id: string
  items: { productId: string; name: string; price: number; quantity: number; image: string; sellerName: string }[]
  customerName: string
  customerPhone: string
  address: string
  city: string
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  notes?: string
}

export type Category = {
  id: string
  name: string
  icon: string
  color: string
}
