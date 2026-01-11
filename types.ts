
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  phone: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
  featured: boolean;
  menu: Dish[];
}

export interface CartItem extends Dish {
  quantity: number;
  restaurantId: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  restaurantName: string;
  paymentMethod: string;
  note?: string;
  cancelReason?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
