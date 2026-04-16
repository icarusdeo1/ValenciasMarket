import type { MenuItem } from '@/types';
import { TORTILLA_CHOICE, CHILI_SAUCE, BREAKFAST_MEAT_CHOICE } from '@/constants/optionGroups';

/** Served with Rice, Beans, Corn or Flour Tortillas. */
export const breakfastPlates: MenuItem[] = [
  {
    id: 'huevos-rancheros',
    name: 'Huevos Rancheros',
    price: 14.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'huevos-a-la-mexicana',
    name: 'Huevos a la Mexicana',
    price: 14.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'huevos-con-nopales',
    name: 'Huevos con Nopales',
    price: 13.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'huevos-con-jamon',
    name: 'Huevos con Jamon',
    price: 13.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'huevos-con-chorizo',
    name: 'Huevos con Chorizo',
    price: 14.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'machaca',
    name: 'Machaca',
    price: 14.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE],
  },
  {
    id: 'chilaquiles-rojos-verde',
    name: 'Chilaquiles Rojos/Verde',
    price: 14.99,
    category: 'Breakfast Plates',
    channel: 'taqueria',
    optionGroups: [TORTILLA_CHOICE, CHILI_SAUCE],
  },
];

export const breakfastBurritos: MenuItem[] = [
  {
    id: 'no-28-huevos-pico-de-gallo-y-queso',
    name: '#28 Huevos, Pico de Gallo y Queso',
    price: 10.59,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-29-huevos-chorizo-papas-y-queso',
    name: '#29 Huevos, Chorizo, Papas y Queso',
    price: 10.89,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-30-huevos-jamon-y-queso',
    name: '#30 Huevos, Jamon y Queso',
    price: 10.89,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-31-huevos-tocino-papas-y-queso',
    name: '#31 Huevos, Tocino, Papas y Queso',
    price: 10.59,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-32-huevos-asada-papas',
    name: '#32 Huevos, Asada, Papas',
    price: 12.59,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-33-machaca-burrito',
    name: '#33 Machaca Burrito',
    price: 12.59,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
  },
  {
    id: 'no-34-burrito-combinado',
    name: '#34 Burrito Combinado',
    price: 13.29,
    category: 'Breakfast Burritos',
    channel: 'taqueria',
    optionGroups: [BREAKFAST_MEAT_CHOICE],
  },
];
