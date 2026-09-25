import type { Seller, Product, Category } from './types'

export const CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: '📱', color: '#4285F4' },
  { id: 'fashion',     name: 'Fashion',     icon: '👕', color: '#EA4335' },
  { id: 'home',        name: 'Home',        icon: '🏠', color: '#34A853' },
  { id: 'beauty',      name: 'Beauty',      icon: '💄', color: '#EC4899' },
  { id: 'food',        name: 'Food',        icon: '🍔', color: '#FBBC05' },
  { id: 'sports',      name: 'Sports',      icon: '⚽', color: '#FF8C00' },
  { id: 'books',       name: 'Books',       icon: '📚', color: '#A855F7' },
  { id: 'kids',        name: 'Kids',        icon: '🧸', color: '#14B8A6' },
]

export const SELLERS: Seller[] = [
  {
    id: 's1', name: 'TechHub TZ', logo: 'https://ui-avatars.com/api/?name=TH&background=4285F4&color=fff',
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    description: 'Bidhaa halisi za electronics — simu, laptops, accessories. Warranty 1 year.',
    location: 'Dar es Salaam', rating: 4.8, reviews: 1240, followers: 5600,
    verified: true, joinedAt: '2024-01-15',
    phone: '+255 712 345 678', whatsapp: '255712345678',
  },
  {
    id: 's2', name: 'Mama Zawadi Fashion', logo: 'https://ui-avatars.com/api/?name=MZ&background=EA4335&color=fff',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    description: 'Mavazi ya kitanzania — kanga, kitenge, vitenge, na modern wear.',
    location: 'Arusha', rating: 4.9, reviews: 890, followers: 3200,
    verified: true, joinedAt: '2024-02-20',
    phone: '+255 754 111 222', whatsapp: '255754111222',
  },
  {
    id: 's3', name: 'Kilimanjaro Home', logo: 'https://ui-avatars.com/api/?name=KH&background=34A853&color=fff',
    banner: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800',
    description: 'Furniture, decor, na vifaa vya nyumbani kwa bei rafiki.',
    location: 'Moshi', rating: 4.6, reviews: 420, followers: 1800,
    verified: true, joinedAt: '2024-03-05',
    phone: '+255 786 333 444', whatsapp: '255786333444',
  },
  {
    id: 's4', name: 'Zanzibar Beauty', logo: 'https://ui-avatars.com/api/?name=ZB&background=EC4899&color=fff',
    banner: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
    description: 'Bidhaa za urembo — skincare, makeup, na essential oils.',
    location: 'Zanzibar', rating: 4.7, reviews: 660, followers: 2900,
    verified: true, joinedAt: '2024-01-28',
    phone: '+255 777 555 666', whatsapp: '255777555666',
  },
  {
    id: 's5', name: 'Spice Island Foods', logo: 'https://ui-avatars.com/api/?name=SI&background=FBBC05&color=000',
    banner: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    description: 'Viungo halisi vya Zanzibar, chai, na vyakula vya asili.',
    location: 'Zanzibar', rating: 4.9, reviews: 1120, followers: 4100,
    verified: true, joinedAt: '2024-02-10',
    phone: '+255 768 777 888', whatsapp: '255768777888',
  },
  {
    id: 's6', name: 'Sports Arena', logo: 'https://ui-avatars.com/api/?name=SA&background=FF8C00&color=fff',
    banner: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    description: 'Vifaa vya michezo — kandanda, mpira wa kikapu, fitness, na zaidi.',
    location: 'Mwanza', rating: 4.5, reviews: 380, followers: 1500,
    verified: true, joinedAt: '2024-04-12',
    phone: '+255 715 999 000', whatsapp: '255715999000',
  },
  {
    id: 's7', name: 'Book World TZ', logo: 'https://ui-avatars.com/api/?name=BW&background=A855F7&color=fff',
    banner: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    description: 'Vitabu vya Kiswahili na Kiingereza, novels, textbooks, na stationery.',
    location: 'Dodoma', rating: 4.8, reviews: 520, followers: 2100,
    verified: true, joinedAt: '2024-03-18',
    phone: '+255 745 123 456', whatsapp: '255745123456',
  },
  {
    id: 's8', name: 'Kids Paradise', logo: 'https://ui-avatars.com/api/?name=KP&background=14B8A6&color=fff',
    banner: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800',
    description: 'Zawadi za watoto, nguo, viatu, na toys salama.',
    location: 'Dar es Salaam', rating: 4.7, reviews: 440, followers: 1900,
    verified: true, joinedAt: '2024-04-02',
    phone: '+255 765 234 567', whatsapp: '255765234567',
  },
  {
    id: 's9', name: 'Mkuki wa Dhahabu', logo: 'https://ui-avatars.com/api/?name=MD&background=6B7280&color=fff',
    banner: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
    description: 'Sanaa za mikono — vinyago, mapambo, na kazi za kitamaduni.',
    location: 'Bagamoyo', rating: 4.9, reviews: 310, followers: 1400,
    verified: true, joinedAt: '2024-02-25',
    phone: '+255 756 345 678', whatsapp: '255756345678',
  },
  {
    id: 's10', name: 'Mobile Masters', logo: 'https://ui-avatars.com/api/?name=MM&background=0EA5E9&color=fff',
    banner: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    description: 'Simu za mkononi, tablets, na accessories za kila brand.',
    location: 'Mbeya', rating: 4.6, reviews: 780, followers: 3400,
    verified: true, joinedAt: '2024-01-30',
    phone: '+255 785 456 789', whatsapp: '255785456789',
  },
]

export const PRODUCTS: Product[] = [
  // TechHub TZ
  { id: 'p1', sellerId: 's1', name: 'Samsung Galaxy A54 5G', description: 'Simu ya kisasa, camera 50MP, battery 5000mAh, 8GB RAM, 256GB storage. Warranty 1 year.', price: 780000, oldPrice: 900000, stock: 15, images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'], category: 'electronics', subcategory: 'Smartphones', rating: 4.7, reviewsCount: 234, soldCount: 456, tags: ['samsung', '5g', 'android'], createdAt: '2025-01-15', featured: true, trending: true },
  { id: 'p2', sellerId: 's1', name: 'MacBook Air M2 13"', description: 'Laptop nyepesi yenye nguvu — Apple M2 chip, 8GB RAM, 256GB SSD. Bora kwa kazi za kitaalamu.', price: 3200000, oldPrice: 3500000, stock: 5, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'], category: 'electronics', subcategory: 'Laptops', rating: 4.9, reviewsCount: 189, soldCount: 234, tags: ['apple', 'macbook', 'm2'], createdAt: '2025-01-10', featured: true },
  { id: 'p3', sellerId: 's1', name: 'Sony WH-1000XM5 Headphones', description: 'Noise cancelling headphones bora duniani. Battery 30hrs, sound quality ya hali ya juu.', price: 850000, oldPrice: 950000, stock: 20, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'], category: 'electronics', subcategory: 'Audio', rating: 4.8, reviewsCount: 445, soldCount: 678, tags: ['sony', 'headphones', 'noise-cancelling'], createdAt: '2025-01-05', trending: true },

  // Mama Zawadi Fashion
  { id: 'p4', sellerId: 's2', name: 'Kitenge Dress ya Kisasa', description: 'Nguo ya kitenge iliyoundwa kisasa. Rangi nzuri, kitambaa cha hali ya juu. Sizes zote zinapatikana.', price: 85000, oldPrice: 120000, stock: 25, images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600'], category: 'fashion', subcategory: 'Women', rating: 4.9, reviewsCount: 156, soldCount: 289, tags: ['kitenge', 'dress', 'tanzania'], createdAt: '2025-01-20', featured: true, trending: true },
  { id: 'p5', sellerId: 's2', name: 'Kanga ya Zanzibar (Jozi)', description: 'Kanga asili ya Zanzibar, jozi 2, ubora wa hali ya juu. Rangi za kuvutia.', price: 45000, stock: 40, images: ['https://images.unsplash.com/photo-1591389703635-e15a07b842d7?w=600'], category: 'fashion', subcategory: 'Traditional', rating: 4.7, reviewsCount: 89, soldCount: 178, tags: ['kanga', 'zanzibar', 'traditional'], createdAt: '2025-01-12' },
  { id: 'p6', sellerId: 's2', name: 'Shirt ya Kitenge ya Wanaume', description: 'Shirt ya kitenge kwa wanaume. Perfect kwa sherehe na matukio maalum.', price: 55000, oldPrice: 70000, stock: 30, images: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600'], category: 'fashion', subcategory: 'Men', rating: 4.6, reviewsCount: 67, soldCount: 123, tags: ['kitenge', 'shirt', 'men'], createdAt: '2025-01-18' },

  // Kilimanjaro Home
  { id: 'p7', sellerId: 's3', name: 'Sofa ya Vitanda 3-Seater', description: 'Sofa ya kisasa, kitambaa cha kupendeza, vizuri kwa sebule. Delivery inapatikana Dar.', price: 850000, oldPrice: 1050000, stock: 8, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'], category: 'home', subcategory: 'Furniture', rating: 4.5, reviewsCount: 45, soldCount: 78, tags: ['sofa', 'furniture'], createdAt: '2025-01-08', featured: true },
  { id: 'p8', sellerId: 's3', name: 'Kitanda cha Mbao (Queen Size)', description: 'Kitanda cha mbao ngumu, imara, kinachodumu miaka mingi. Ina frame na headboard.', price: 620000, stock: 12, images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'], category: 'home', subcategory: 'Furniture', rating: 4.7, reviewsCount: 78, soldCount: 145, tags: ['bed', 'furniture', 'wood'], createdAt: '2025-01-15' },
  { id: 'p9', sellerId: 's3', name: 'Seti ya Vitambaa vya Meza', description: 'Seti ya vitambaa 6 vya meza, rangi tofauti, kitambaa cha pamba.', price: 35000, oldPrice: 45000, stock: 50, images: ['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600'], category: 'home', subcategory: 'Decor', rating: 4.4, reviewsCount: 34, soldCount: 89, tags: ['table', 'cloth'], createdAt: '2025-01-20' },

  // Zanzibar Beauty
  { id: 'p10', sellerId: 's4', name: 'Coconut Oil ya Zanzibar (500ml)', description: 'Mafuta ya nazi halisi ya Zanzibar. Kwa nywele, ngozi, na kupikia. Pure 100%.', price: 25000, oldPrice: 35000, stock: 100, images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'], category: 'beauty', subcategory: 'Skincare', rating: 4.9, reviewsCount: 456, soldCount: 1230, tags: ['coconut', 'oil', 'zanzibar'], createdAt: '2025-01-05', featured: true, trending: true },
  { id: 'p11', sellerId: 's4', name: 'Seti ya Skincare ya Asili', description: 'Seti kamili — cleanser, toner, moisturizer. Viungo vya asili vya Zanzibar.', price: 85000, stock: 30, images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600'], category: 'beauty', subcategory: 'Skincare', rating: 4.8, reviewsCount: 234, soldCount: 445, tags: ['skincare', 'natural'], createdAt: '2025-01-12' },
  { id: 'p12', sellerId: 's4', name: 'Essential Oil - Lavender', description: 'Mafuta ya lavender kwa relaxation na massage. 100ml bottle.', price: 35000, stock: 60, images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600'], category: 'beauty', subcategory: 'Aromatherapy', rating: 4.7, reviewsCount: 123, soldCount: 267, tags: ['lavender', 'essential-oil'], createdAt: '2025-01-18' },

  // Spice Island Foods
  { id: 'p13', sellerId: 's5', name: 'Viungo vya Pilau (Seti)', description: 'Seti kamili ya viungo vya pilau vya Zanzibar — karafuu, iliki, mdalasini, n.k.', price: 15000, oldPrice: 20000, stock: 200, images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600'], category: 'food', subcategory: 'Spices', rating: 4.9, reviewsCount: 678, soldCount: 2340, tags: ['spices', 'pilau', 'zanzibar'], createdAt: '2025-01-03', featured: true, trending: true },
  { id: 'p14', sellerId: 's5', name: 'Chai ya Tangawizi (500g)', description: 'Chai ya tangawizi halisi ya Zanzibar. Kwa afya na ladha nzuri.', price: 12000, stock: 150, images: ['https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600'], category: 'food', subcategory: 'Tea', rating: 4.8, reviewsCount: 345, soldCount: 890, tags: ['tea', 'ginger'], createdAt: '2025-01-10' },
  { id: 'p15', sellerId: 's5', name: 'Asali ya Asili ya Miombo', description: 'Asali halisi ya miombo, haijachanganywa. 1kg jar.', price: 28000, stock: 80, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600'], category: 'food', subcategory: 'Honey', rating: 4.9, reviewsCount: 234, soldCount: 567, tags: ['honey', 'natural'], createdAt: '2025-01-15' },

  // Sports Arena
  { id: 'p16', sellerId: 's6', name: 'Mpira wa Kandanda Nike', description: 'Mpira wa kandanda wa Nike, saizi ya kawaida, kwa michezo ya nje.', price: 65000, oldPrice: 85000, stock: 45, images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600'], category: 'sports', subcategory: 'Football', rating: 4.6, reviewsCount: 123, soldCount: 289, tags: ['nike', 'football'], createdAt: '2025-01-08' },
  { id: 'p17', sellerId: 's6', name: 'Dumbbells Seti (10kg x 2)', description: 'Seti ya dumbbells 10kg kila moja. Kwa mazoezi ya nyumbani.', price: 180000, stock: 20, images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'], category: 'sports', subcategory: 'Fitness', rating: 4.7, reviewsCount: 67, soldCount: 134, tags: ['dumbbells', 'fitness'], createdAt: '2025-01-12', featured: true },
  { id: 'p18', sellerId: 's6', name: 'Yoga Mat Premium', description: 'Yoga mat nene, ya kuzuia kuteleza. Kwa yoga na pilates.', price: 45000, stock: 60, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'], category: 'sports', subcategory: 'Yoga', rating: 4.8, reviewsCount: 189, soldCount: 445, tags: ['yoga', 'mat'], createdAt: '2025-01-18' },

  // Book World TZ
  { id: 'p19', sellerId: 's7', name: 'Kiswahili Kitukuzwe - Kitabu', description: 'Kitabu cha Kiswahili kwa wanafunzi wa sekondari. Kimeandikwa na wataalamu.', price: 18000, stock: 100, images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'], category: 'books', subcategory: 'Education', rating: 4.7, reviewsCount: 234, soldCount: 678, tags: ['kiswahili', 'education'], createdAt: '2025-01-05' },
  { id: 'p20', sellerId: 's7', name: 'Novel - Tanzania Yetu', description: 'Novel ya kisasa inayohusu maisha ya Tanzania. Kusoma kwa burudani.', price: 22000, oldPrice: 28000, stock: 75, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'], category: 'books', subcategory: 'Fiction', rating: 4.6, reviewsCount: 89, soldCount: 178, tags: ['novel', 'fiction'], createdAt: '2025-01-12' },
  { id: 'p21', sellerId: 's7', name: 'Seti ya Vitabu vya Watoto', description: 'Seti ya vitabu 5 vya watoto, na picha za rangi. Kwa umri 3-7.', price: 45000, stock: 40, images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600'], category: 'books', subcategory: 'Kids', rating: 4.9, reviewsCount: 156, soldCount: 289, tags: ['kids', 'books'], createdAt: '2025-01-18', featured: true },

  // Kids Paradise
  { id: 'p22', sellerId: 's8', name: 'Toy ya Kujenga (Blocks 100pcs)', description: 'Seti ya blocks 100 kwa watoto. Kuwasaidia kujifunza na kubuni.', price: 55000, oldPrice: 70000, stock: 35, images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'], category: 'kids', subcategory: 'Toys', rating: 4.8, reviewsCount: 178, soldCount: 356, tags: ['blocks', 'toys'], createdAt: '2025-01-08', featured: true },
  { id: 'p23', sellerId: 's8', name: 'Nguo za Watoto (Seti 3)', description: 'Seti ya nguo 3 za watoto, cotton, rangi nzuri. Umri 1-5.', price: 38000, stock: 50, images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600'], category: 'kids', subcategory: 'Clothing', rating: 4.6, reviewsCount: 123, soldCount: 234, tags: ['kids', 'clothing'], createdAt: '2025-01-15' },
  { id: 'p24', sellerId: 's8', name: 'Viatu vya Watoto (Sport)', description: 'Viatu vya sport vya watoto, comfortable, sizes 20-30.', price: 42000, oldPrice: 55000, stock: 40, images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600'], category: 'kids', subcategory: 'Shoes', rating: 4.7, reviewsCount: 89, soldCount: 178, tags: ['kids', 'shoes'], createdAt: '2025-01-18' },

  // Mkuki wa Dhahabu
  { id: 'p25', sellerId: 's9', name: 'Kinyago cha Mbao (Handmade)', description: 'Kinyago cha mbao kilichochongwa kwa mkono na mafundi wa Bagamoyo.', price: 120000, stock: 15, images: ['https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600'], category: 'home', subcategory: 'Art', rating: 4.9, reviewsCount: 67, soldCount: 89, tags: ['art', 'wood', 'handmade'], createdAt: '2025-01-10', featured: true },
  { id: 'p26', sellerId: 's9', name: 'Basket ya Mkono', description: 'Basket ya kusuka kwa mkono, kwa matunda au decor.', price: 45000, stock: 30, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600'], category: 'home', subcategory: 'Decor', rating: 4.7, reviewsCount: 45, soldCount: 78, tags: ['basket', 'handmade'], createdAt: '2025-01-15' },
  { id: 'p27', sellerId: 's9', name: 'Mapambo ya Ukuta (Tie-Dye)', description: 'Mapambo ya ukuta ya tie-dye, ya kitamaduni. Ukubwa 1m x 1.5m.', price: 85000, stock: 20, images: ['https://images.unsplash.com/photo-1615529162924-f8605388461d?w=600'], category: 'home', subcategory: 'Decor', rating: 4.8, reviewsCount: 34, soldCount: 56, tags: ['decor', 'wall-art'], createdAt: '2025-01-20' },

  // Mobile Masters
  { id: 'p28', sellerId: 's10', name: 'iPhone 15 Pro Max 256GB', description: 'iPhone 15 Pro Max, Titanium, 256GB. Simu ya hali ya juu kabisa.', price: 4200000, oldPrice: 4800000, stock: 3, images: ['https://images.unsplash.com/photo-1696446702183-8a5a0e6c3a4e?w=600'], category: 'electronics', subcategory: 'Smartphones', rating: 4.9, reviewsCount: 234, soldCount: 89, tags: ['apple', 'iphone', '5g'], createdAt: '2025-01-02', featured: true, trending: true },
  { id: 'p29', sellerId: 's10', name: 'Xiaomi Redmi Note 13', description: 'Xiaomi Redmi Note 13, 8GB RAM, 256GB, camera 108MP. Bei nafuu.', price: 520000, oldPrice: 620000, stock: 25, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'], category: 'electronics', subcategory: 'Smartphones', rating: 4.7, reviewsCount: 456, soldCount: 890, tags: ['xiaomi', 'redmi', 'budget'], createdAt: '2025-01-08', trending: true },
  { id: 'p30', sellerId: 's10', name: 'AirPods Pro 2', description: 'AirPods Pro 2, noise cancelling, wireless charging. Halisi.', price: 650000, stock: 18, images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'], category: 'electronics', subcategory: 'Audio', rating: 4.8, reviewsCount: 345, soldCount: 567, tags: ['apple', 'airpods'], createdAt: '2025-01-10', featured: true },
]

// Helpers
export const getSeller = (id: string) => SELLERS.find((s) => s.id === id)
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)
export const getProductsBySeller = (sellerId: string) => PRODUCTS.filter((p) => p.sellerId === sellerId)
export const getProductsByCategory = (cat: string) => PRODUCTS.filter((p) => p.category === cat)

export const formatTZS = (n: number) => `TZS ${n.toLocaleString('en-US')}`
