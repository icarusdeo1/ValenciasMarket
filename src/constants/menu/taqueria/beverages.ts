import type { MenuItem } from '@/types';
import { SODA_CHOICE } from '@/constants/optionGroups';

export const beverages: MenuItem[] = [
  {
    id: 'sodas',
    name: 'Sodas',
    price: 2.99,
    category: 'Beverages',
    channel: 'taqueria',
    optionGroups: [SODA_CHOICE],
  },
  {
    id: 'orange-juice-16oz',
    name: 'Orange Juice 16oz',
    price: 9.59,
    category: 'Beverages',
    channel: 'taqueria',
  },
  {
    id: 'orange-and-carrot-juice-16oz',
    name: 'Orange & Carrot Juice 16oz',
    price: 9.59,
    category: 'Beverages',
    channel: 'taqueria',
  },
  {
    id: 'leche-milk',
    name: 'Leche/Milk',
    price: 1.99,
    category: 'Beverages',
    channel: 'taqueria',
  },
  {
    id: 'cafe-coffee',
    name: 'Cafe/Coffee',
    price: 1.99,
    category: 'Beverages',
    channel: 'taqueria',
  },
  {
    id: 'celsius',
    name: 'Celsius',
    price: 3.69,
    category: 'Beverages',
    channel: 'taqueria',
  },
];
