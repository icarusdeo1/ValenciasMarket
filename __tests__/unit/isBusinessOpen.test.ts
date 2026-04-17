import { isBusinessOpen, getBusinessHoursDisplay } from '../../src/utils/isBusinessOpen';

/**
 * Business hours (America/Los_Angeles):
 *   Mon-Thu: 8:00 AM - 8:00 PM
 *   Fri-Sun: 8:00 AM - 9:00 PM
 *
 * PST (winter) = UTC-8, PDT (summer) = UTC-7.
 * Dates below are chosen deliberately in PST (Jan) and PDT (July) to verify
 * both sides of the DST transition.
 */

function laDate(year: number, month1to12: number, day: number, hour: number, minute: number, isPDT: boolean) {
  const offsetHours = isPDT ? 7 : 8;
  return new Date(Date.UTC(year, month1to12 - 1, day, hour + offsetHours, minute));
}

describe('isBusinessOpen', () => {
  describe('Monday (weekday, 8am-8pm)', () => {
    it('returns false at 7:59 AM (before open)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 5, 7, 59, false))).toBe(false);
    });

    it('returns true at 8:00 AM (at open)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 5, 8, 0, false))).toBe(true);
    });

    it('returns true at 7:59 PM (just before close)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 5, 19, 59, false))).toBe(true);
    });

    it('returns false at 8:00 PM (at close — exclusive)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 5, 20, 0, false))).toBe(false);
    });
  });

  describe('Friday (extended, 8am-9pm)', () => {
    it('returns true at 8:59 PM (Friday extended hours)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 9, 20, 59, false))).toBe(true);
    });

    it('returns false at 9:00 PM', () => {
      expect(isBusinessOpen(laDate(2026, 1, 9, 21, 0, false))).toBe(false);
    });
  });

  describe('Saturday (weekend, 8am-9pm)', () => {
    it('returns true at 8:30 PM', () => {
      expect(isBusinessOpen(laDate(2026, 1, 10, 20, 30, false))).toBe(true);
    });

    it('returns false at 9:00 PM', () => {
      expect(isBusinessOpen(laDate(2026, 1, 10, 21, 0, false))).toBe(false);
    });
  });

  describe('Sunday (weekend, 8am-9pm)', () => {
    it('returns true at 8:00 AM', () => {
      expect(isBusinessOpen(laDate(2026, 1, 11, 8, 0, false))).toBe(true);
    });

    it('returns true at 8:59 PM', () => {
      expect(isBusinessOpen(laDate(2026, 1, 11, 20, 59, false))).toBe(true);
    });
  });

  describe('midnight / early AM', () => {
    it('returns false at 12:00 AM Tuesday (overnight closed)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 6, 0, 0, false))).toBe(false);
    });

    it('returns false at 3:00 AM Saturday (overnight closed)', () => {
      expect(isBusinessOpen(laDate(2026, 1, 10, 3, 0, false))).toBe(false);
    });
  });

  describe('DST (PDT) — July', () => {
    it('returns true at 12:00 PM on a Wednesday in July', () => {
      // Wed July 8 2026, PDT (UTC-7)
      expect(isBusinessOpen(laDate(2026, 7, 8, 12, 0, true))).toBe(true);
    });

    it('returns false at 8:30 PM Wednesday (weekday 8pm close)', () => {
      expect(isBusinessOpen(laDate(2026, 7, 8, 20, 30, true))).toBe(false);
    });

    it('returns true at 8:30 PM Saturday (weekend 9pm close)', () => {
      // Sat July 11 2026
      expect(isBusinessOpen(laDate(2026, 7, 11, 20, 30, true))).toBe(true);
    });
  });

  describe('no argument', () => {
    it('uses current time without throwing', () => {
      expect(typeof isBusinessOpen()).toBe('boolean');
    });
  });
});

describe('getBusinessHoursDisplay', () => {
  it('returns a string covering both weekday and weekend hours', () => {
    const display = getBusinessHoursDisplay();
    expect(display).toContain('Mon');
    expect(display).toContain('Fri');
    expect(display).toContain('8:00 AM');
    expect(display).toContain('8:00 PM');
    expect(display).toContain('9:00 PM');
  });
});
