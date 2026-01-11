
import { Restaurant, OrderStatus } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Haven',
    description: 'Experience the ultimate gourmet burger journey with our signature aged wagyu patties and secret house sauces.',
    cuisine: 'American • Burgers',
    rating: 4.8,
    deliveryTime: '20-30 min',
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
    featured: true,
    menu: [
      { id: 'd1', name: 'Classic Cheeseburger', description: 'Juicy beef patty with aged cheddar', price: 12.99, image: 'https://picsum.photos/seed/b1/200/200', category: 'Main' },
      { id: 'd2', name: 'Bacon Deluxe', description: 'Crispy bacon and smoky BBQ sauce', price: 14.50, image: 'https://picsum.photos/seed/b2/200/200', category: 'Main' },
      { id: 'd3', name: 'Truffle Fries', description: 'Hand-cut fries with truffle oil', price: 6.99, image: 'https://picsum.photos/seed/b3/200/200', category: 'Sides' }
    ]
  },
  {
    id: '2',
    name: 'Sushi Zen',
    description: 'Authentic Edo-style sushi prepared by master chefs with daily fresh imports from the world\'s best fish markets.',
    cuisine: 'Japanese • Sushi',
    rating: 4.9,
    deliveryTime: '30-45 min',
    minOrder: 25,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    featured: true,
    menu: [
      { id: 'd4', name: 'Dragon Roll', description: 'Tempura shrimp with avocado topping', price: 18.00, image: 'https://picsum.photos/seed/s1/200/200', category: 'Sushi' },
      { id: 'd5', name: 'Salmon Nigiri', description: 'Fresh Atlantic salmon over vinegared rice', price: 12.00, image: 'https://picsum.photos/seed/s2/200/200', category: 'Nigiri' }
    ]
  },
  {
    id: '3',
    name: 'Pasta Palace',
    description: 'Fresh, hand-rolled pasta made every morning, served with traditional family recipes that have crossed oceans.',
    cuisine: 'Italian • Pasta',
    rating: 4.6,
    deliveryTime: '25-35 min',
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800',
    featured: true,
    menu: [
      { id: 'd6', name: 'Truffle Carbonara', description: 'Creamy pasta with pecorino and guanciale', price: 16.99, image: 'https://picsum.photos/seed/p1/200/200', category: 'Pasta' }
    ]
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    description: 'Vibrant street-style tacos and traditional Mexican favorites served with a modern, spicy twist.',
    cuisine: 'Mexican • Street Food',
    rating: 4.5,
    deliveryTime: '15-25 min',
    minOrder: 10,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    featured: true,
    menu: [
      { id: 'd7', name: 'Al Pastor Tacos', description: 'Marinated pork with pineapple', price: 9.99, image: 'https://picsum.photos/seed/t1/200/200', category: 'Tacos' }
    ]
  }
];

export const CANCEL_REASONS = [
  "Changed my mind",
  "Wait time is too long",
  "Incorrect items in cart",
  "Found better price elsewhere",
  "Accidental order"
];
