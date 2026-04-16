import type { SelectedChoice } from '@/types';

export function calculateItemTotal(
  basePrice: number,
  selectedChoices: SelectedChoice[],
  quantity: number,
): { raw: number; formatted: string } {
  const modifiers = selectedChoices.reduce(
    (sum, choice) => sum + choice.priceModifier,
    0,
  );
  const raw = (basePrice + modifiers) * quantity;
  return {
    raw: Math.round(raw * 100) / 100,
    formatted: formatPrice(raw),
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
