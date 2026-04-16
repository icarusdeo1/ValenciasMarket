import type { OptionGroup } from '@/types';

export const TORTILLA_CHOICE: OptionGroup = {
  id: 'tortilla_choice',
  name: 'Tortilla Choice',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'corn', label: 'Corn Tortillas' },
    { id: 'flour', label: 'Flour Tortillas' },
  ],
};

export const BURRITO_MEAT_CHOICE: OptionGroup = {
  id: 'burrito_meat_choice',
  name: 'Meat Choice',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'asada', label: 'Asada / Steak' },
    { id: 'pollo', label: 'Pollo / Chicken' },
    { id: 'barbacoa', label: 'Barbacoa / Shredded Beef' },
    { id: 'carnitas', label: 'Carnitas / Shredded Fried Pork' },
    { id: 'alpastor', label: 'Al Pastor / Marinated Pork' },
    { id: 'chorizo', label: 'Chorizo / Mexican Sausage' },
    { id: 'lengua', label: 'Lengua', priceModifier: 1.99 },
    { id: 'tripas', label: 'Tripas', priceModifier: 1.99 },
  ],
};

export const TACO_MEAT_CHOICE: OptionGroup = {
  id: 'taco_meat_choice',
  name: 'Meat Choice',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'asada', label: 'Asada / Steak' },
    { id: 'pollo', label: 'Pollo / Chicken' },
    { id: 'barbacoa', label: 'Barbacoa / Shredded Beef' },
    { id: 'carnitas', label: 'Carnitas / Shredded Fried Pork' },
    { id: 'alpastor', label: 'Al Pastor / Marinated Pork' },
    { id: 'chorizo', label: 'Chorizo / Mexican Sausage' },
  ],
};

export const NACHO_MEAT: OptionGroup = {
  id: 'nacho_meat',
  name: 'Meat Choice',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'asada', label: 'Asada / Steak' },
    { id: 'pollo', label: 'Pollo / Chicken' },
    { id: 'barbacoa', label: 'Barbacoa / Shredded Beef' },
    { id: 'carnitas', label: 'Carnitas / Shredded Fried Pork' },
    { id: 'alpastor', label: 'Al Pastor / Marinated Pork' },
    { id: 'chorizo', label: 'Chorizo / Mexican Sausage' },
    { id: 'lengua', label: 'Lengua', priceModifier: 0.99 },
    { id: 'tripas', label: 'Tripas', priceModifier: 0.99 },
  ],
};

export const ENCHILADA_FLAUTA_SIZE: OptionGroup = {
  id: 'enchilada_flauta_size',
  name: 'Filling',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'beef', label: 'Beef' },
    { id: 'chicken', label: 'Chicken' },
    { id: 'pork', label: 'Pork' },
    { id: 'cheese', label: 'Cheese' },
  ],
};

export const FAJITA_SIZE: OptionGroup = {
  id: 'fajita_size',
  name: 'Protein',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'chicken', label: 'Chicken' },
    { id: 'steak', label: 'Steak' },
  ],
};

export const CHILI_SAUCE: OptionGroup = {
  id: 'chili_sauce',
  name: 'Chili Sauce',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'green', label: 'Green' },
    { id: 'red', label: 'Red' },
  ],
};

export const EXTRA_BURRITO_MEAT: OptionGroup = {
  id: 'extra_burrito_meat',
  name: 'Extra Meat',
  required: false,
  type: 'optional_toggle',
  choices: [
    { id: 'yes', label: 'Add Extra Meat', priceModifier: 2.59 },
    { id: 'no', label: 'No Extra Meat' },
  ],
};

export const EXTRA_QUESADILLA_MEAT: OptionGroup = {
  id: 'extra_quesadilla_meat',
  name: 'Extra Meat',
  required: false,
  type: 'optional_toggle',
  choices: [
    { id: 'yes', label: 'Add Extra Meat', priceModifier: 1.99 },
    { id: 'no', label: 'No Extra Meat' },
  ],
};

export const EXTRA_NACHO_MEAT: OptionGroup = {
  id: 'extra_nacho_meat',
  name: 'Extra Meat',
  required: false,
  type: 'optional_toggle',
  choices: [
    { id: 'yes', label: 'Add Extra Meat', priceModifier: 2.59 },
    { id: 'no', label: 'No Extra Meat' },
  ],
};

export const SODA_CHOICE: OptionGroup = {
  id: 'soda_choice',
  name: 'Flavor',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'watermelon', label: 'Watermelon' },
    { id: 'strawberry', label: 'Strawberry' },
    { id: 'mandarin', label: 'Mandarin' },
    { id: 'mango', label: 'Mango' },
    { id: 'guava', label: 'Guava' },
    { id: 'fanta_orange', label: 'Fanta Orange' },
    { id: 'mineragua', label: 'Miner Agua Sparkling Water' },
    { id: 'coca_cola', label: 'Coca-Cola Bottle' },
    { id: 'squirt', label: 'Squirt' },
  ],
};

export const BREAKFAST_MEAT_CHOICE: OptionGroup = {
  id: 'breakfast_meat_choice',
  name: 'Meat Choice',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'bacon', label: 'Bacon' },
    { id: 'ham', label: 'Ham' },
    { id: 'chorizo', label: 'Chorizo' },
  ],
};

export const TAMALE_SIZE: OptionGroup = {
  id: 'tamale_size',
  name: 'Type',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'chicken', label: 'Chicken' },
    { id: 'pork', label: 'Pork' },
    { id: 'cheese', label: 'Cheese' },
    { id: 'uchepos', label: 'Uchepos (Corn)' },
  ],
};

export const TAMALE_INGREDIENTS: OptionGroup = {
  id: 'tamale_ingredients',
  name: 'Add Ingredients',
  required: false,
  type: 'optional_toggle',
  choices: [
    { id: 'yes', label: 'Add Ingredients', priceModifier: 12.0 },
    { id: 'no', label: 'No Extra Ingredients' },
  ],
};

export const SEASONING: OptionGroup = {
  id: 'seasoning',
  name: 'Seasoning',
  required: true,
  type: 'single_select',
  choices: [
    { id: 'non_marinated', label: 'Non Marinated' },
    { id: 'marinated', label: 'Marinated' },
  ],
};

export const ALL_OPTION_GROUPS = [
  TORTILLA_CHOICE,
  BURRITO_MEAT_CHOICE,
  TACO_MEAT_CHOICE,
  NACHO_MEAT,
  ENCHILADA_FLAUTA_SIZE,
  FAJITA_SIZE,
  CHILI_SAUCE,
  EXTRA_BURRITO_MEAT,
  EXTRA_QUESADILLA_MEAT,
  EXTRA_NACHO_MEAT,
  SODA_CHOICE,
  BREAKFAST_MEAT_CHOICE,
  TAMALE_SIZE,
  TAMALE_INGREDIENTS,
  SEASONING,
] as const;
