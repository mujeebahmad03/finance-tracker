import { Currencies } from "./currencies";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  );
}

export const GetFormattedDate = (date: Date) => {
  const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    date
  );
  const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    date
  );
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}`;
};

export const GetFormatterForCurrency = (currency: string) => {
  const locale = Currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
};
