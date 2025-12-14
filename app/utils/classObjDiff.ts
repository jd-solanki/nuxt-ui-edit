import type { PartialDeep } from 'type-fest'

/**
 * Type guard to check if a value is a plain object (not array, not null)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Normalizes class values (string or array of strings) into a Set of individual classes
 * Handles both space-separated strings and arrays of class strings
 *
 * @param value - The value to normalize (string, array, or other)
 * @returns Set of individual CSS classes, or null if value is not class-like
 *
 * @example
 * normalizeClasses('flex items-center') // Set(['flex', 'items-center'])
 * normalizeClasses(['flex items-center', 'gap-2']) // Set(['flex', 'items-center', 'gap-2'])
 * normalizeClasses('') // Set([])
 */
function normalizeClasses(value: unknown): Set<string> | null {
  // Handle empty values
  if (value === '' || value === null || value === undefined) {
    return new Set<string>()
  }

  // Handle string: split by whitespace and filter empty strings
  if (typeof value === 'string') {
    return new Set(
      value
        .split(/\s+/)
        .filter(cls => cls.length > 0),
    )
  }

  // Handle array: flatten and split each element
  if (Array.isArray(value)) {
    const classes = value.flatMap((item) => {
      if (typeof item === 'string') {
        return item.split(/\s+/).filter(cls => cls.length > 0)
      }
      return []
    })
    return new Set(classes)
  }

  // Not a class-like value
  return null
}

/**
 * Checks if a value appears to contain CSS classes
 * Used to determine whether to apply class comparison logic
 *
 * @param value - The value to check
 * @returns true if value is a string or array that could contain classes
 */
function isClassValue(value: unknown): boolean {
  if (typeof value === 'string') {
    return true
  }
  if (Array.isArray(value)) {
    // Check if array contains strings (potential class arrays)
    return value.every(item => typeof item === 'string')
  }
  return false
}

/**
 * Deep equality comparison for arrays
 * Compares arrays element by element, recursively handling nested structures
 *
 * @param arr1 - First array to compare
 * @param arr2 - Second array to compare
 * @returns true if arrays are deeply equal, false otherwise
 */
function arraysEqual(arr1: unknown[], arr2: unknown[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    const val1 = arr1[i]
    const val2 = arr2[i]

    // Handle nested objects
    if (isPlainObject(val1) && isPlainObject(val2)) {
      const diff = classObjDiff(
        val1 as Record<string, unknown>,
        val2 as Record<string, unknown>,
      )
      if (diff !== undefined) {
        return false
      }
      continue
    }

    // Handle nested arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (!arraysEqual(val1, val2)) {
        return false
      }
      continue
    }

    // Primitive comparison
    if (val1 !== val2) {
      return false
    }
  }

  return true
}

/**
 * Computes the difference between two class sets
 * Returns only the classes that exist in the original but not in the updated
 *
 * @param originalClasses - Set of classes from the original object
 * @param updatedClasses - Set of classes from the updated object
 * @returns Space-separated string of classes that were removed/changed, or undefined if no diff
 */
function getClassDiff(originalClasses: Set<string>, updatedClasses: Set<string>): string | undefined {
  const diff = new Set<string>()

  // Find classes in original that are not in updated
  for (const cls of originalClasses) {
    if (!updatedClasses.has(cls)) {
      diff.add(cls)
    }
  }

  // Return undefined if no differences
  if (diff.size === 0) {
    return undefined
  }

  // Return space-separated string of different classes
  return Array.from(diff).join(' ')
}

/**
 * Recursively compares two nested objects containing Tailwind CSS classes
 * Returns a partial object containing only the differences from the original
 *
 * Key features:
 * - Deep nested object comparison
 * - Smart Tailwind class comparison (handles both strings and arrays)
 * - Detects individual class changes (e.g., 'rounded-xl' vs 'rounded-md')
 * - Returns only properties that differ in the original compared to updated
 * - Handles deletions (keys in original but not in updated)
 * - Optimized with Set data structure for O(1) class lookups
 *
 * @param original - The original object (baseline for comparison)
 * @param updated - The updated object (new state)
 * @returns Partial object containing only the differences, or undefined if no differences
 *
 * @example
 * ```ts
 * const obj1 = {
 *   slots: {
 *     base: 'rounded-xl font-medium flex items-center'
 *   }
 * }
 *
 * const obj2 = {
 *   slots: {
 *     base: 'rounded-md font-medium flex items-center'
 *   }
 * }
 *
 * classObjDiff(obj1, obj2)
 * // Returns: { slots: { base: 'rounded-xl' } }
 * // Only 'rounded-xl' is different (changed to 'rounded-md')
 * ```
 *
 * @example
 * ```ts
 * const obj1 = {
 *   slots: {
 *     base: 'rounded-xl font-medium',
 *     label: 'truncate'
 *   }
 * }
 *
 * const obj2 = {
 *   slots: {
 *     base: ['rounded-md font-medium', 'transition-colors'],
 *     label: 'truncate'
 *   }
 * }
 *
 * classObjDiff(obj1, obj2)
 * // Returns: { slots: { base: 'rounded-xl' } }
 * // Handles string vs array comparison
 * ```
 */
export function classObjDiff<T extends Record<string, unknown>>(
  original: T,
  updated: T,
): PartialDeep<T> | undefined {
  // Handle null/undefined edge cases
  if (!original || !updated) {
    return original as PartialDeep<T>
  }

  // If both are identical references, no diff
  if (original === updated) {
    return undefined
  }

  // Result object to accumulate differences
  const diff: Record<string, unknown> = {}
  let hasDifferences = false

  // Iterate through all keys in the original object
  for (const key of Object.keys(original)) {
    const originalValue = original[key]
    const updatedValue = updated[key]

    // Case 1: Key deleted in updated (exists in original but not in updated)
    if (!(key in updated)) {
      diff[key] = originalValue
      hasDifferences = true
      continue
    }

    // Case 2: Both values are plain objects - recurse
    if (isPlainObject(originalValue) && isPlainObject(updatedValue)) {
      const nestedDiff = classObjDiff(
        originalValue as Record<string, unknown>,
        updatedValue as Record<string, unknown>,
      )

      if (nestedDiff !== undefined && Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff
        hasDifferences = true
      }
      continue
    }

    // Case 3: Values are class-like (string or array of strings) - compare classes
    if (isClassValue(originalValue) && isClassValue(updatedValue)) {
      const originalClasses = normalizeClasses(originalValue)
      const updatedClasses = normalizeClasses(updatedValue)

      if (originalClasses && updatedClasses) {
        const classDiff = getClassDiff(originalClasses, updatedClasses)
        if (classDiff !== undefined) {
          diff[key] = classDiff
          hasDifferences = true
        }
      }
      continue
    }

    // Case 4: Non-class arrays - deep comparison
    if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
      if (!arraysEqual(originalValue, updatedValue)) {
        diff[key] = originalValue
        hasDifferences = true
      }
      continue
    }

    // Case 5: Primitive or other type comparison - strict equality
    if (originalValue !== updatedValue) {
      diff[key] = originalValue
      hasDifferences = true
    }
  }

  // Return undefined if no differences found
  return hasDifferences ? (diff as PartialDeep<T>) : undefined
}
