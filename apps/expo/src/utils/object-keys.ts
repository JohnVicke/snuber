export function objectKeys<T extends Record<PropertyKey, unknown>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}
