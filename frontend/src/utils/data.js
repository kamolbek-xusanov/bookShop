const uzMonths = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
]
const pad = (n) => String(n).padStart(2, '0')

// "20 oktyabr 2026, 14:35" (uz) or the browser's own format for en / ru
export function formatDateTime(value, lang = 'uz') {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  if (lang.startsWith('uz')) {
    return `${date.getDate()} ${uzMonths[date.getMonth()]} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  return date.toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short' })
}

// a book counts as edited when it was changed more than 2 seconds after it was created
export const wasEdited = (book) =>
  Boolean(book.updatedAt && book.createdAt) &&
  new Date(book.updatedAt) - new Date(book.createdAt) > 2000