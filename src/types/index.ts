export type OptionChoiceType = {
  id: string;
  label: string;
  priceModifier?: number;
};

export type OptionGroupType = 'single_select' | 'optional_toggle';

export type OptionGroup = {
  id: string;
  name: string;
  required: boolean;
  type: OptionGroupType;
  choices: OptionChoiceType[];
};

export type Channel = 'taqueria' | 'market';

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  channel: Channel;
  imageUrl?: string;
  unit?: string;
  optionGroups?: OptionGroup[];
  requiresAgeVerification?: boolean;
  maxQuantityNote?: string;
};

export type SelectedChoice = {
  groupId: string;
  choiceId: string;
  priceModifier: number;
};

export type CartItem = {
  cartItemId: string;
  menuItem: MenuItem;
  selectedChoices: SelectedChoice[];
  specialInstructions: string;
  quantity: number;
};

export type OrderType = 'pickup' | 'delivery';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  orderType: OrderType;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  tip: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyAt?: string;
  deliveryAddress?: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  photoUrl?: string;
};
