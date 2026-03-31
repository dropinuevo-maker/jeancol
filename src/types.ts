export interface Review {
  id: string;
  productId: string;
  userName: string;
  userLastName?: string;
  email?: string;
  phone?: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  images?: string[];
  videos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  userId?: string;
  customerName?: string;
}

export interface ProductFeature {
  name: string;
  value: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  value: string;
  stock: number;
  price?: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  video?: string;
  discount?: number;
  oldPrice?: number;
  offerPrice?: number;
  offerEndDate?: string;
  description?: string;
  features?: ProductFeature[];
  sizes?: string[];
  colors?: any; // Can be string[] or {name, hex}[]
  variations?: ProductVariation[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[] | number;
  isNew?: boolean;
  isTrending?: boolean;
  hasVariations?: boolean;
  featured?: boolean;
  new?: boolean;
  trending?: boolean;
  active?: boolean;
  sizeGuideType?: 'shoes' | 'clothing' | 'accessories' | string;
  weight?: string;
  dimensions?: string;
  material?: string;
  brand?: string;
  sku?: string;
  sales?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariations?: Record<string, string>;
  size?: string;
  color?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  customer: string;
  customerName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: 'efectivo' | 'transferencia' | 'contraentrega' | string;
  createdAt: string;
  updatedAt?: string;
  date?: string;
  notes?: string;
  userId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'shipping' | 'percentage';
  value?: number;
  discount: number;
  minPurchase: number;
  maxDiscount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom?: string;
  validUntil?: string;
  expiresAt?: string;
  expiryDate?: string;
  isActive: boolean;
  active?: boolean;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  active: boolean;
  order: number;
  description?: string;
  count?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: import('@supabase/supabase-js').User | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoading?: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signIn: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signUp: (email: string, password: string, name?: string) => Promise<{success: boolean; error?: string}>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

export interface HomeBanner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

export interface HomeSection {
  id: string;
  name: string;
  type: 'categories' | 'products' | 'new_arrivals' | 'testimonials' | 'blog' | 'custom';
  active: boolean;
  order: number;
}

export interface StoreConfig {
  name: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  isMaintenanceMode: boolean;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  description?: string;
  banners?: HomeBanner[];
  sections?: HomeSection[];
  homeCollections?: any[];
  trustItems?: { icon: string; title: string; description: string }[];
  testimonials?: { id: string | number; name: string; role: string; content: string; avatar: string; rating: number }[];
  testimonialsTitle?: string;
  testimonialsSubtitle?: string;
  collectionsTitle?: string;
  collectionsSubtitle?: string;
  featuredTitle?: string;
  featuredSubtitle?: string;
}

export interface StoreContextType {
  config: StoreConfig;
  updateConfig: (newConfig: Partial<StoreConfig>) => Promise<boolean>;
  updateSettings: (newSettings: any) => Promise<boolean>;
  isLoading: boolean;
  loading?: boolean;
  fetchConfig: () => Promise<void>;
  setIsMaintenanceMode: (value: boolean) => void;
  getStoreName: () => string;
  getLogo: () => string;
  getMaintenanceTimeLeft: () => { days: number; hours: number; minutes: number; seconds: number } | null;
  settings?: any;
}

export interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  getSubtotal: () => number;
  getTotal: () => number;
  freeShippingProgress: number;
  remainingForFreeShipping: number;
  freeShippingThreshold: number;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  discount: number;
  finalTotal: number;
}

export interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryByName: (name: string) => Category | undefined;
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  stats: any;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<boolean>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  getStats: () => any;
  getUserOrders: (userId: string) => Order[];
}

export interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  pendingReviews: Review[];
  approvedReviews: Review[];
  getPendingCount: () => number;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  addReviewDirect: (review: any) => Promise<void>;
  updateReviewStatus: (id: string, status: Review['status']) => Promise<void>;
  updateReviewDirect: (id: string, review: any) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  deleteReviewDirect: (id: string) => Promise<void>;
  approveReview: (id: string) => Promise<void>;
  rejectReview: (id: string) => Promise<void>;
  getProductReviews: (productId: string) => Review[];
  fetchReviews: () => Promise<void>;
}

export interface CouponContextType {
  coupons: Coupon[];
  loading: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => Promise<void>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCouponStatus: (id: string) => Promise<void>;
  validateCoupon: (code: string, subtotal: number) => Promise<Coupon | null>;
  fetchCoupons: () => Promise<void>;
}

export interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id?: string) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}
