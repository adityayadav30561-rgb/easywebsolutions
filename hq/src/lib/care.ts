/**
 * Care-plan billing periods. A subscription renews on `billingDay` (1–28)
 * each month; "hours used this month" means hours logged in the current
 * billing period, not the calendar month.
 */

export function clampBillingDay(day: number) {
  return Math.min(28, Math.max(1, Math.trunc(day)));
}

/** Start (inclusive) and end (exclusive) of the billing period containing `at`. */
export function billingPeriod(billingDay: number, at: Date = new Date()) {
  const d = clampBillingDay(billingDay);
  const y = at.getUTCFullYear();
  const m = at.getUTCMonth();
  const start = at.getUTCDate() >= d ? new Date(Date.UTC(y, m, d)) : new Date(Date.UTC(y, m - 1, d));
  const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, d));
  return { start, end };
}

/** First billing date strictly after `from` that falls on `billingDay`. */
export function nextBillingDate(billingDay: number, from: Date = new Date()) {
  return billingPeriod(billingDay, from).end;
}

export function usage(minutesUsed: number, includedHours: number) {
  const usedHours = Math.round((minutesUsed / 60) * 100) / 100;
  const pct = includedHours > 0 ? Math.min(100, Math.round((usedHours / includedHours) * 100)) : 0;
  return { usedHours, includedHours, remaining: Math.max(0, Math.round((includedHours - usedHours) * 100) / 100), pct, over: includedHours > 0 && usedHours > includedHours };
}
