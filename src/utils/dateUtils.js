/**
 * Returns today's date as a YYYY-MM-DD string (local time).
 */
export function todayKey() {
  const d = new Date()
  return formatDateKey(d)
}

/**
 * Formats a Date object to YYYY-MM-DD (local time).
 */
export function formatDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Parses a YYYY-MM-DD string to a local Date (midnight).
 */
export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Returns a human-readable label for a date key.
 * e.g. "Today, Friday, June 16" or "Friday, June 15"
 */
export function formatDateLabel(key, includeRelative = false) {
  const today = todayKey()
  const yesterday = formatDateKey(new Date(Date.now() - 86400000))
  const date = parseDateKey(key)

  const longLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) return longLabel

  if (key === today) return `Today · ${longLabel}`
  if (key === yesterday) return `Yesterday · ${longLabel}`
  return longLabel
}

/**
 * Returns an array of the last N date keys (most recent first), including today.
 */
export function lastNDays(n = 7) {
  const keys = []
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.now() - i * 86400000)
    keys.push(formatDateKey(d))
  }
  return keys
}

/**
 * localStorage key for daily activity data.
 */
export function dailyStorageKey(dateKey) {
  return `pawket_data_${dateKey}`
}

/**
 * localStorage key for pets profiles (never changes).
 */
export const PETS_KEY = 'pawket_pets'

/**
 * localStorage key for notes (never changes).
 */
export const NOTES_KEY = 'pawket_notes'

/**
 * Build a fresh blank routine for a pet (all tasks unchecked).
 */
export const DEFAULT_ROUTINE = {
  meal_morning: false,
  meal_noon: false,
  meal_night: false,
  water_refill: false,
  activity_playtime: false,
  activity_clean: false,
}
