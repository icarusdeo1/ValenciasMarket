import {
  TAQUERIA_CATEGORIES,
  MARKET_CATEGORIES,
  ALL_TAQUERIA_ITEMS,
  ALL_MARKET_ITEMS,
  ALL_MENU_ITEMS,
} from '../../src/constants/menu';
import { ALL_OPTION_GROUPS } from '../../src/constants/optionGroups';
import type { OptionGroup } from '../../src/types';

const KNOWN_GROUP_IDS = new Set(ALL_OPTION_GROUPS.map((g) => g.id));

describe('menu data integrity', () => {
  describe('pricing', () => {
    it('every item has a price strictly greater than 0', () => {
      const offenders = ALL_MENU_ITEMS.filter((i) => !(i.price > 0));
      expect(offenders).toEqual([]);
    });

    it('every item has a non-empty name', () => {
      const offenders = ALL_MENU_ITEMS.filter((i) => !i.name.trim());
      expect(offenders).toEqual([]);
    });

    it('every item has a unique id', () => {
      const ids = ALL_MENU_ITEMS.map((i) => i.id);
      const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
      expect(duplicates).toEqual([]);
    });
  });

  describe('option groups', () => {
    it('every required single_select group has at least 2 choices', () => {
      const offenders = ALL_OPTION_GROUPS.filter(
        (g: OptionGroup) =>
          g.required && g.type === 'single_select' && g.choices.length < 2,
      );
      expect(offenders).toEqual([]);
    });

    it('every priceModifier is a non-negative finite number when present', () => {
      const offenders: string[] = [];
      for (const group of ALL_OPTION_GROUPS) {
        for (const choice of group.choices) {
          if (choice.priceModifier === undefined) continue;
          if (!Number.isFinite(choice.priceModifier) || choice.priceModifier < 0) {
            offenders.push(`${group.id}:${choice.id}=${choice.priceModifier}`);
          }
        }
      }
      expect(offenders).toEqual([]);
    });

    it('every item only references known option group ids', () => {
      const offenders: string[] = [];
      for (const item of ALL_MENU_ITEMS) {
        for (const group of item.optionGroups ?? []) {
          if (!KNOWN_GROUP_IDS.has(group.id)) {
            offenders.push(`${item.id} -> ${group.id}`);
          }
        }
      }
      expect(offenders).toEqual([]);
    });

    it('exports exactly 15 reusable option group templates', () => {
      expect(ALL_OPTION_GROUPS.length).toBe(15);
    });

    it('every option group has a unique id', () => {
      const ids = ALL_OPTION_GROUPS.map((g) => g.id);
      const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
      expect(duplicates).toEqual([]);
    });
  });

  describe('taqueria catalog', () => {
    it('has exactly 109 items (PRD 3.1.14)', () => {
      expect(ALL_TAQUERIA_ITEMS.length).toBe(109);
    });

    it('all items have channel=taqueria', () => {
      const offenders = ALL_TAQUERIA_ITEMS.filter((i) => i.channel !== 'taqueria');
      expect(offenders).toEqual([]);
    });

    it('exposes 12 display categories (11 PRD categories; breakfast split into plates + burritos)', () => {
      expect(TAQUERIA_CATEGORIES.length).toBe(12);
    });
  });

  describe('market catalog', () => {
    it('has at least one item', () => {
      expect(ALL_MARKET_ITEMS.length).toBeGreaterThan(0);
    });

    it('all items have channel=market', () => {
      const offenders = ALL_MARKET_ITEMS.filter((i) => i.channel !== 'market');
      expect(offenders).toEqual([]);
    });

    it('exposes 14 display categories', () => {
      expect(MARKET_CATEGORIES.length).toBe(14);
    });

    it('every item has a unit label', () => {
      const offenders = ALL_MARKET_ITEMS.filter((i) => !i.unit?.trim());
      expect(offenders.map((o) => o.id)).toEqual([]);
    });

    it('beer items are flagged requiresAgeVerification', () => {
      const beer = MARKET_CATEGORIES.find((c) => c.name === 'Beer');
      expect(beer).toBeDefined();
      const offenders = beer!.items.filter((i) => i.requiresAgeVerification !== true);
      expect(offenders.map((o) => o.id)).toEqual([]);
    });

    it('beef items carry the 10 POUND MAX note', () => {
      const beef = MARKET_CATEGORIES.find((c) => c.name === 'Beef');
      expect(beef).toBeDefined();
      const offenders = beef!.items.filter((i) => i.maxQuantityNote !== '10 POUND MAX');
      expect(offenders.map((o) => o.id)).toEqual([]);
    });
  });

  describe('specific upcharge invariants (CLAUDE.md rules)', () => {
    function findGroup(id: string) {
      return ALL_OPTION_GROUPS.find((g) => g.id === id);
    }

    it('Burrito Meat Choice: Lengua and Tripas are +$1.99', () => {
      const group = findGroup('burrito_meat_choice');
      expect(group?.choices.find((c) => c.id === 'lengua')?.priceModifier).toBe(1.99);
      expect(group?.choices.find((c) => c.id === 'tripas')?.priceModifier).toBe(1.99);
    });

    it('Nacho Meat: Lengua and Tripas are +$0.99 (NOT +$1.99)', () => {
      const group = findGroup('nacho_meat');
      expect(group?.choices.find((c) => c.id === 'lengua')?.priceModifier).toBe(0.99);
      expect(group?.choices.find((c) => c.id === 'tripas')?.priceModifier).toBe(0.99);
    });

    it('Extra Burrito Meat toggle is +$2.59', () => {
      const group = findGroup('extra_burrito_meat');
      expect(group?.choices.find((c) => c.id === 'yes')?.priceModifier).toBe(2.59);
    });

    it('Extra Quesadilla Meat toggle is +$1.99 (NOT +$2.59)', () => {
      const group = findGroup('extra_quesadilla_meat');
      expect(group?.choices.find((c) => c.id === 'yes')?.priceModifier).toBe(1.99);
    });
  });
});
