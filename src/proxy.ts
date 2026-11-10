import { NextResponse, type NextRequest } from 'next/server'

import { defaultLocale, isLocale, segmentsUzToRu } from './i18n/config'

// Публичные адреса → внутренние маршруты src/app/(frontend)/[lang]/...
//   /katalog              → /ru/katalog         (русский без приставки)
//   /uz/buyurtma-tortlar  → /uz/torty-na-zakaz  (узбекские адреса)
//
// Только rewrite, без редиректов: Next.js может повторно вызвать proxy
// с уже переписанным адресом, и редирект зациклится. Дубли вроде /ru/katalog
// закрываются тегом canonical на каждой странице.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1] ?? ''

  if (isLocale(first)) {
    if (first !== 'uz') return NextResponse.next()

    const parts = pathname.split('/')
    const ruSegment = parts[2] ? segmentsUzToRu[parts[2]] : undefined
    if (!ruSegment || ruSegment === parts[2]) return NextResponse.next()

    parts[2] = ruSegment
    const url = request.nextUrl.clone()
    url.pathname = parts.join('/')
    return NextResponse.rewrite(url)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // Не трогаем админку, API, служебные файлы Next.js и файлы с расширением.
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
