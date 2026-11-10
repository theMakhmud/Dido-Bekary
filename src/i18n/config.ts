// Языки сайта и локализованные адреса разделов.
// Папки страниц в src/app называются по русским адресам;
// узбекские адреса переводятся в русские в src/proxy.ts.

export const locales = ['ru', 'uz'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ru'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

// Первый сегмент адреса: русский → узбекский.
// Сегменты, которых нет в списке, одинаковы в обоих языках (например, katalog).
export const segmentsRuToUz: Record<string, string> = {
  'torty-na-zakaz': 'buyurtma-tortlar',
  'dostavka-i-oplata': 'yetkazib-berish-va-tolov',
  'o-nas': 'biz-haqimizda',
  korzina: 'savat',
  oformlenie: 'rasmiylashtirish',
  zakaz: 'buyurtma',
  oferta: 'oferta',
  privacy: 'maxfiylik',
}

export const segmentsUzToRu: Record<string, string> = Object.fromEntries(
  Object.entries(segmentsRuToUz).map(([ru, uz]) => [uz, ru]),
)

/**
 * Публичный адрес страницы.
 * @param path путь в русском виде, например '/torty-na-zakaz/portfolio'
 */
export function localePath(locale: Locale, path: string = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (locale === defaultLocale) return clean

  const [, first = '', ...rest] = clean.split('/')
  const translated = segmentsRuToUz[first] ?? first
  const joined = [translated, ...rest].filter(Boolean).join('/')
  return joined ? `/${locale}/${joined}` : `/${locale}`
}

/**
 * Переводит любой адрес сайта (публичный или внутренний) в русский путь без приставки.
 * Нужен переключателю языка.
 */
export function toRuPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] && isLocale(parts[0])) parts.shift()
  if (parts[0]) parts[0] = segmentsUzToRu[parts[0]] ?? parts[0]
  return `/${parts.join('/')}`
}
