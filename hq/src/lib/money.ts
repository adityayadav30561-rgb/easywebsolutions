/** Line-item maths shared by quotations and invoices (and their editors). */

export type LineInput = {
  description: string;
  quantity: number;
  unitPrice: number;
  discountPct?: number;
  taxRate?: number;
  serviceItemId?: string | null;
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function computeLine(l: LineInput) {
  const gross = round2(l.quantity * l.unitPrice);
  const discount = round2(gross * ((l.discountPct ?? 0) / 100));
  const net = round2(gross - discount);
  const tax = round2(net * ((l.taxRate ?? 0) / 100));
  return { gross, discount, net, tax, lineTotal: net };
}

export function computeTotals(lines: LineInput[]) {
  let subtotal = 0;
  let discountTotal = 0;
  let taxTotal = 0;
  for (const l of lines) {
    const c = computeLine(l);
    subtotal += c.gross;
    discountTotal += c.discount;
    taxTotal += c.tax;
  }
  subtotal = round2(subtotal);
  discountTotal = round2(discountTotal);
  taxTotal = round2(taxTotal);
  return { subtotal, discountTotal, taxTotal, total: round2(subtotal - discountTotal + taxTotal) };
}

export function formatMoney(value: unknown, currency = "USD") {
  const n = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
