import type { MenuItem } from '@/types';

import { breakfastPlates, breakfastBurritos } from './taqueria/breakfast';
import { burritos } from './taqueria/burritos';
import { tacos } from './taqueria/tacos';
import { sides } from './taqueria/sides';
import { antojitos } from './taqueria/antojitos';
import { soups } from './taqueria/soups';
import { seafood } from './taqueria/seafood';
import { quesadillas } from './taqueria/quesadillas';
import { comboPlates } from './taqueria/comboPlates';
import { beverages } from './taqueria/beverages';
import { cateringItems } from './taqueria/catering';

import { beef } from './market/beef';
import { pork } from './market/pork';
import { marketSeafood } from './market/seafood';
import { poultry } from './market/poultry';
import { cheese } from './market/cheese';
import { produce } from './market/produce';
import { tortillas } from './market/tortillas';
import { canned } from './market/canned';
import { grocery } from './market/grocery';
import { dryGoods } from './market/dryGoods';
import { hotSauces } from './market/hotSauces';
import { hotFood } from './market/hotFood';
import { marketBeverages } from './market/beverages';
import { beer } from './market/beer';

export type CategoryMap = {
  name: string;
  description?: string;
  items: MenuItem[];
};

export const TAQUERIA_CATEGORIES: CategoryMap[] = [
  { name: 'Breakfast Plates', description: 'Served with Rice, Beans, Corn or Flour Tortillas.', items: breakfastPlates },
  { name: 'Breakfast Burritos', items: breakfastBurritos },
  { name: 'Burritos', items: burritos },
  { name: 'Tacos', items: tacos },
  { name: 'Sides', items: sides },
  { name: 'Antojitos', items: antojitos },
  { name: 'Soups', items: soups },
  { name: 'Seafood', items: seafood },
  { name: 'Quesadillas', items: quesadillas },
  { name: 'Combo Plates', description: 'Served with rice, beans, and tortillas.', items: comboPlates },
  { name: 'Beverages', items: beverages },
  { name: 'Catering', items: cateringItems },
];

export const MARKET_CATEGORIES: CategoryMap[] = [
  { name: 'Beef', items: beef },
  { name: 'Pork', items: pork },
  { name: 'Seafood', items: marketSeafood },
  { name: 'Poultry', items: poultry },
  { name: 'Cheese & Deli', items: cheese },
  { name: 'Produce', items: produce },
  { name: 'Tortillas & Tostadas', items: tortillas },
  { name: 'Canned Products', items: canned },
  { name: 'Grocery', items: grocery },
  { name: 'Dry Goods', items: dryGoods },
  { name: 'Hot Sauces', items: hotSauces },
  { name: 'Hot Food', items: hotFood },
  { name: 'Beverages', items: marketBeverages },
  { name: 'Beer', items: beer },
];

export const ALL_TAQUERIA_ITEMS: MenuItem[] = TAQUERIA_CATEGORIES.flatMap((c) => c.items);
export const ALL_MARKET_ITEMS: MenuItem[] = MARKET_CATEGORIES.flatMap((c) => c.items);
export const ALL_MENU_ITEMS: MenuItem[] = [...ALL_TAQUERIA_ITEMS, ...ALL_MARKET_ITEMS];
