/**
 * Utilidades de fechas
 * 
 * Usamos dayjs como en el proyecto original
 */

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/sv'
import 'dayjs/locale/ar'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

export function formatDate(
  date: string | Date,
  format: string = 'LL',
  locale: string = 'en'
): string {
  return dayjs(date).locale(locale).format(format)
}

export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date,
  locale: string = 'en'
): string {
  const start = dayjs(startDate).locale(locale)
  const end = dayjs(endDate).locale(locale)
  
  if (start.year() !== end.year()) {
    return `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`
  }
  
  if (start.month() !== end.month()) {
    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`
  }
  
  return `${start.format('MMM D')} - ${end.format('D, YYYY')}`
}

export function getRelativeTime(date: string | Date, locale: string = 'en'): string {
  return dayjs(date).locale(locale).fromNow()
}

export function isDateInPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs())
}

export function isDateInFuture(date: string | Date): boolean {
  return dayjs(date).isAfter(dayjs())
}

export function getDaysUntil(date: string | Date): number {
  return dayjs(date).diff(dayjs(), 'day')
}

export { dayjs }
