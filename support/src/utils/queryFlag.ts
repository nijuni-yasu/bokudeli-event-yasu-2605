import type { LocationQuery, LocationQueryValue } from 'vue-router'

export const isQueryFlagActive = (value: LocationQueryValue | LocationQueryValue[], expected: string): boolean =>
  value === expected

export const withQueryFlag = (query: LocationQuery, key: string, flagValue: string, active: boolean): LocationQuery => {
  const next: LocationQuery = { ...query }
  if (active) {
    next[key] = flagValue
  } else {
    delete next[key]
  }
  return next
}
