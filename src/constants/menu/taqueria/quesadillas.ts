import type { MenuItem } from '@/types';
import { BURRITO_MEAT_CHOICE, EXTRA_QUESADILLA_MEAT } from '@/constants/optionGroups';

export const quesadillas: MenuItem[] = [
  {
    id: 'quesadilla-sin-carne',
    name: 'Quesadilla (Sin carne / without meat)',
    price: 7.59,
    category: 'Quesadillas',
    channel: 'taqueria',
  },
  {
    id: 'quesadilla-con-carne',
    name: 'Quesadilla (Con carne / with meat)',
    price: 10.99,
    category: 'Quesadillas',
    channel: 'taqueria',
    optionGroups: [BURRITO_MEAT_CHOICE, EXTRA_QUESADILLA_MEAT],
  },
  {
    id: 'quesadilla-combo-without-meat',
    name: 'Quesadilla Combo (without meat)',
    price: 11.99,
    category: 'Quesadillas',
    channel: 'taqueria',
  },
  {
    id: 'quesadilla-combo-with-meat',
    name: 'Quesadilla Combo (with meat)',
    price: 15.99,
    category: 'Quesadillas',
    channel: 'taqueria',
    optionGroups: [BURRITO_MEAT_CHOICE, EXTRA_QUESADILLA_MEAT],
  },
];
