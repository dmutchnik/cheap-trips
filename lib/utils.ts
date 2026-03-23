export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function isoNow() {
  return new Date().toISOString();
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function parseDateOnly(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getTripLengthDays(departureDate: string, returnDate: string) {
  const departureMs = parseDateOnly(departureDate).getTime();
  const returnMs = parseDateOnly(returnDate).getTime();
  return Math.round((returnMs - departureMs) / DAY_IN_MS);
}

export function enumerateDates(start: string, end: string) {
  const values: string[] = [];
  let currentMs = parseDateOnly(start).getTime();
  const endMs = parseDateOnly(end).getTime();

  while (currentMs <= endMs) {
    values.push(toDateOnly(new Date(currentMs)));
    currentMs += DAY_IN_MS;
  }

  return values;
}

export function addDaysDate(date: string, days: number) {
  return toDateOnly(new Date(parseDateOnly(date).getTime() + days * DAY_IN_MS));
}

export function currency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function unique<T>(values: T[]) {
  return [...new Set(values)];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function chunk<T>(values: T[], size: number) {
  const output: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    output.push(values.slice(index, index + size));
  }
  return output;
}
