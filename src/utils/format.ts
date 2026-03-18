import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatCurrency(amount: number) {
  return `¥${amount.toFixed(2)}`
}

export function formatDateLabel(
  value: number,
  pattern = 'yyyy年M月d日'
) {
  return format(value, pattern, { locale: zhCN })
}

export function formatDateTimeLabel(value: number) {
  return format(value, 'MM月dd日 HH:mm', { locale: zhCN })
}

export function formatDateInputValue(value: number) {
  return format(value, 'yyyy-MM-dd')
}
