import type { MenuItem } from '@/types';
import { TAMALE_SIZE, TAMALE_INGREDIENTS } from '@/constants/optionGroups';

export const cateringItems: MenuItem[] = [
  {
    id: 'tamales',
    name: 'Tamales',
    price: 26.99,
    category: 'Catering',
    channel: 'taqueria',
    optionGroups: [TAMALE_SIZE, TAMALE_INGREDIENTS],
  },
  {
    id: 'taquitos',
    name: 'Taquitos',
    price: 145.00,
    category: 'Catering',
    channel: 'taqueria',
  },
  {
    id: 'birria-tacos',
    name: 'Birria Tacos',
    price: 115.00,
    category: 'Catering',
    channel: 'taqueria',
  },
  {
    id: 'street-tacos',
    name: 'Street Tacos',
    price: 85.00,
    category: 'Catering',
    channel: 'taqueria',
  },
  {
    id: 'small-tray-rice',
    name: 'Small Tray Rice',
    price: 25.00,
    category: 'Catering',
    channel: 'taqueria',
  },
  {
    id: 'small-tray-beans',
    name: 'Small Tray Beans',
    price: 30.00,
    category: 'Catering',
    channel: 'taqueria',
  },
];
