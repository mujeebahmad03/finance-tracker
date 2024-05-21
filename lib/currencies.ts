export const Currencies = [
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ EUR", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
  { value: "CAD", label: "$ Canadian Dollar", locale: "en-CA" },
  { value: "AUD", label: "$ Australian Dollar", locale: "en-AU" },
  { value: "NZD", label: "$ New Zealand Dollar", locale: "en-NZ" },
  { value: "NGN", label: "₦ Nigeria Naira", locale: "en-NG" },
  { value: "CHF", label: "CHF Franc", locale: "de-CH" },
  { value: "MXN", label: "$ Mexican Peso", locale: "es-MX" },
  { value: "BRL", label: "R$ Brazilian Real", locale: "pt-BR" },
  { value: "CNY", label: "¥ Yuan Renminbi", locale: "zh-CN" },
  { value: "INR", label: "₹ Indian Rupee", locale: "hi-IN" },
  { value: "RUB", label: "₽ Russian Ruble", locale: "ru-RU" },
  { value: "ZAR", label: "R ZAR Rand", locale: "af-ZA" },
  { value: "KRW", label: "₩ Won", locale: "ko-KR" },
  { value: "SEK", label: "kr SEK Krona", locale: "sv-SE" },
  { value: "DKK", label: "kr DKK Krone", locale: "da-DK" },
  { value: "NOK", label: "kr NOK Krone", locale: "nb-NO" },
  { value: "PLN", label: "zł PLN Zloty", locale: "pl-PL" },
];

export type Currency = (typeof Currencies)[0];
