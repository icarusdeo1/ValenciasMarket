import { calculateItemTotal, formatPrice } from '../../src/utils/calculateItemTotal';
import type { SelectedChoice } from '../../src/types';

describe('calculateItemTotal', () => {
  it('returns base price with no modifiers, qty 1', () => {
    const result = calculateItemTotal(11.99, [], 1);
    expect(result.raw).toBe(11.99);
    expect(result.formatted).toBe('$11.99');
  });

  // TC-OPT-04: Regular Burrito ($11.99) + Lengua (+$1.99) = $13.98
  it('calculates Regular Burrito + Lengua', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'burrito_meat_choice', choiceId: 'lengua', priceModifier: 1.99 },
    ];
    const result = calculateItemTotal(11.99, choices, 1);
    expect(result.raw).toBe(13.98);
    expect(result.formatted).toBe('$13.98');
  });

  // TC-OPT-05: Regular Burrito + Lengua + Extra Meat ($2.59) = $16.57
  it('calculates Regular Burrito + Lengua + Extra Meat', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'burrito_meat_choice', choiceId: 'lengua', priceModifier: 1.99 },
      { groupId: 'extra_burrito_meat', choiceId: 'yes', priceModifier: 2.59 },
    ];
    const result = calculateItemTotal(11.99, choices, 1);
    expect(result.raw).toBe(16.57);
    expect(result.formatted).toBe('$16.57');
  });

  // TC-OPT-06: Above × qty 2 = $33.14
  it('multiplies by quantity', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'burrito_meat_choice', choiceId: 'lengua', priceModifier: 1.99 },
      { groupId: 'extra_burrito_meat', choiceId: 'yes', priceModifier: 2.59 },
    ];
    const result = calculateItemTotal(11.99, choices, 2);
    expect(result.raw).toBe(33.14);
    expect(result.formatted).toBe('$33.14');
  });

  // TC-OPT-07: Nachos With Meat + Lengua (+$0.99, NOT +$1.99)
  it('uses Nacho Meat Lengua upcharge of $0.99', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'nacho_meat', choiceId: 'lengua', priceModifier: 0.99 },
    ];
    const result = calculateItemTotal(14.99, choices, 1);
    expect(result.raw).toBe(15.98);
    expect(result.formatted).toBe('$15.98');
  });

  // TC-OPT-08: Quesadilla Extra Meat (+$1.99, NOT +$2.59)
  it('uses Quesadilla Extra Meat upcharge of $1.99', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'burrito_meat_choice', choiceId: 'asada', priceModifier: 0 },
      { groupId: 'extra_quesadilla_meat', choiceId: 'yes', priceModifier: 1.99 },
    ];
    const result = calculateItemTotal(10.99, choices, 1);
    expect(result.raw).toBe(12.98);
    expect(result.formatted).toBe('$12.98');
  });

  it('handles zero modifiers with high quantity', () => {
    const choices: SelectedChoice[] = [
      { groupId: 'taco_meat_choice', choiceId: 'asada', priceModifier: 0 },
    ];
    const result = calculateItemTotal(4.59, choices, 10);
    expect(result.raw).toBe(45.90);
    expect(result.formatted).toBe('$45.90');
  });
});

describe('formatPrice', () => {
  it('formats with two decimal places', () => {
    expect(formatPrice(5)).toBe('$5.00');
    expect(formatPrice(12.5)).toBe('$12.50');
    expect(formatPrice(0.99)).toBe('$0.99');
  });
});
