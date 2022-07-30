
/**
 * Used for not getting bundlers like webpack and rollup to report
 * warnings/errors about missing exports from PixiJS.
 */
export namespace CompatibilityAccess {
  export function get<TObj, TKey extends keyof TObj>(obj: TObj, key: TKey) {
    return obj[key]
  }
}