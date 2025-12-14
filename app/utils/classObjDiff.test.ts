import { describe, expect, it } from 'vitest'
import { classObjDiff } from './classObjDiff'

describe('classObjDiff', () => {
  /**
   * Test 1: Basic class string comparison - different classes
   * Validates that individual class differences are detected
   */
  it('should detect class differences in string values', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl font-medium inline-flex items-center',
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-md font-medium inline-flex items-center',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      slots: {
        base: 'rounded-xl',
      },
    })
  })

  /**
   * Test 2: String vs Array class comparison
   * Ensures the function handles different formats (string vs array) correctly
   */
  it('should handle string vs array class comparison', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors',
      },
    }

    const obj2 = {
      slots: {
        base: [
          'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75',
          'transition-colors',
        ],
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      slots: {
        base: 'rounded-xl',
      },
    })
  })

  /**
   * Test 3: Identical objects should return undefined
   * Performance check: no unnecessary diff objects for identical inputs
   */
  it('should return undefined for identical objects', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl font-medium',
        label: 'truncate',
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-xl font-medium',
        label: 'truncate',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toBeUndefined()
  })

  /**
   * Test 4: Multiple class changes in a single property
   * Validates detection of multiple changed classes
   */
  it('should detect multiple class changes in a single property', () => {
    const obj1 = {
      button: {
        base: 'px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md',
      },
    }

    const obj2 = {
      button: {
        base: 'px-3 py-1 bg-red-500 text-white rounded-md shadow-sm',
      },
    }

    const result = classObjDiff(obj1, obj2)

    // Should include: px-4, py-2, bg-blue-500, rounded-lg, shadow-md
    expect(result?.button?.base).toBeDefined()
    const resultClasses = (result?.button?.base as string).split(' ').sort()
    expect(resultClasses).toEqual(['bg-blue-500', 'px-4', 'py-2', 'rounded-lg', 'shadow-md'])
  })

  /**
   * Test 5: Deep nested object comparison
   * Ensures recursion works correctly for deeply nested structures
   */
  it('should handle deep nested object structures', () => {
    const obj1 = {
      components: {
        button: {
          slots: {
            base: 'rounded-xl flex',
            icon: 'shrink-0 size-5',
          },
          variants: {
            size: {
              md: 'px-4 py-2',
            },
          },
        },
      },
    }

    const obj2 = {
      components: {
        button: {
          slots: {
            base: 'rounded-md flex',
            icon: 'shrink-0 size-4',
          },
          variants: {
            size: {
              md: 'px-4 py-2',
            },
          },
        },
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      components: {
        button: {
          slots: {
            base: 'rounded-xl',
            icon: 'size-5',
          },
        },
      },
    })
  })

  /**
   * Test 6: Deleted properties (exists in obj1 but not obj2)
   * Validates that removed keys are included in the diff
   */
  it('should include deleted properties in the diff', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl',
        label: 'truncate',
        icon: 'shrink-0',
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-xl',
        label: 'truncate',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      slots: {
        icon: 'shrink-0',
      },
    })
  })

  /**
   * Test 7: Added properties (exists in obj2 but not obj1)
   * Should NOT appear in result (we only care about what changed/removed from obj1)
   */
  it('should not include newly added properties in the diff', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl',
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-xl',
        label: 'truncate',
        icon: 'shrink-0',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toBeUndefined()
  })

  /**
   * Test 8: Empty strings and arrays
   * Edge case handling for empty values
   */
  it('should handle empty strings and arrays correctly', () => {
    const obj1 = {
      slots: {
        base: '',
        label: 'truncate',
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-md',
        label: 'truncate',
      },
    }

    const result = classObjDiff(obj1, obj2)

    // Empty string has no classes, so no diff when classes are added
    expect(result).toBeUndefined()
  })

  /**
   * Test 9: Array with multiple class strings
   * Validates proper handling of arrays containing multiple class strings
   */
  it('should handle arrays with multiple class strings', () => {
    const obj1 = {
      button: {
        base: ['flex items-center gap-2', 'px-4 py-2', 'rounded-xl bg-blue-500'],
      },
    }

    const obj2 = {
      button: {
        base: ['flex items-center gap-2', 'px-4 py-2', 'rounded-md bg-red-500'],
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result?.button?.base).toBeDefined()
    const resultClasses = (result?.button?.base as string).split(' ').sort()
    expect(resultClasses).toEqual(['bg-blue-500', 'rounded-xl'])
  })

  /**
   * Test 10: Primitive value comparison (non-class values)
   * Ensures non-class values are compared correctly
   */
  it('should handle primitive value comparison', () => {
    const obj1 = {
      config: {
        enabled: true,
        count: 10,
        name: 'button',
      },
    }

    const obj2 = {
      config: {
        enabled: false,
        count: 10,
        name: 'input',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      config: {
        enabled: true,
        name: 'button',
      },
    })
  })

  /**
   * Test 11: Mixed class and primitive values
   * Real-world scenario with both types of values
   */
  it('should handle mixed class and primitive values', () => {
    const obj1 = {
      button: {
        base: 'rounded-xl px-4',
        disabled: false,
        size: 'md',
      },
    }

    const obj2 = {
      button: {
        base: 'rounded-md px-4',
        disabled: true,
        size: 'md',
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      button: {
        base: 'rounded-xl',
        disabled: false,
      },
    })
  })

  /**
   * Test 12: Null and undefined handling
   * Edge case validation for null/undefined values
   */
  it('should handle null and undefined values', () => {
    const obj1 = {
      slots: {
        base: 'rounded-xl',
        label: null,
      },
    }

    const obj2 = {
      slots: {
        base: 'rounded-xl',
        label: undefined,
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      slots: {
        label: null,
      },
    })
  })

  /**
   * Test 13: Whitespace normalization
   * Ensures extra whitespace doesn't cause false positives
   */
  it('should normalize whitespace in class strings', () => {
    const obj1 = {
      base: 'flex  items-center   gap-2',
    }

    const obj2 = {
      base: 'flex items-center gap-2',
    }

    const result = classObjDiff(obj1, obj2)

    // Should be identical after normalization
    expect(result).toBeUndefined()
  })

  /**
   * Test 14: Real Nuxt UI AppConfig structure
   * Tests with actual Nuxt UI component config structure
   */
  it('should work with real Nuxt UI button config structure', () => {
    const defaultConfig = {
      slots: {
        base: 'rounded-xl font-medium inline-flex items-center disabled:cursor-not-allowed',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0',
      },
      variants: {
        size: {
          md: 'px-2.5 py-1.5 text-sm gap-1.5',
        },
        color: {
          primary: 'bg-primary text-primary-foreground',
        },
      },
    }

    const customConfig = {
      slots: {
        base: 'rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        trailingIcon: 'shrink-0',
      },
      variants: {
        size: {
          md: 'px-3 py-2 text-base gap-2',
        },
        color: {
          primary: 'bg-primary text-primary-foreground',
        },
      },
    }

    const result = classObjDiff(defaultConfig, customConfig)

    expect(result).toEqual({
      slots: {
        base: 'rounded-xl',
      },
      variants: {
        size: {
          md: 'px-2.5 py-1.5 text-sm gap-1.5',
        },
      },
    })
  })

  /**
   * Test 15: Empty diff result structure
   * When nested objects have no meaningful differences
   */
  it('should return undefined when nested objects have no differences', () => {
    const obj1 = {
      level1: {
        level2: {
          level3: {
            base: 'flex items-center',
          },
        },
      },
    }

    const obj2 = {
      level1: {
        level2: {
          level3: {
            base: 'flex items-center',
          },
        },
      },
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toBeUndefined()
  })

  /**
   * Test 16: Non-class arrays with numbers
   * Arrays containing numbers should be compared by value, not reference
   */
  it('should handle non-class arrays correctly (numbers)', () => {
    const obj1 = {
      a: 1,
      b: {
        c: [2],
        d: 'rounded-lg',
      },
    }

    const obj2 = {
      a: 1,
      b: {
        c: [2],
        d: ['rounded-xl'],
      },
    }

    const result = classObjDiff(obj1, obj2)

    // c: [2] is the same in both, should not appear in diff
    // d changed from 'rounded-lg' to 'rounded-xl'
    expect(result).toEqual({
      b: {
        d: 'rounded-lg',
      },
    })
  })

  /**
   * Test 17: Non-class arrays with different values
   * Should detect when non-class array values differ
   */
  it('should detect differences in non-class arrays', () => {
    const obj1 = {
      values: [1, 2, 3],
      classes: 'flex gap-2',
    }

    const obj2 = {
      values: [1, 2, 4],
      classes: 'flex gap-2',
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      values: [1, 2, 3],
    })
  })

  /**
   * Test 18: Empty arrays comparison
   * Should handle empty arrays correctly
   */
  it('should handle empty arrays', () => {
    const obj1 = {
      items: [],
      classes: 'flex',
    }

    const obj2 = {
      items: [],
      classes: 'flex',
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toBeUndefined()
  })

  /**
   * Test 19: Mixed arrays with objects
   * Arrays containing objects should be compared deeply
   */
  it('should handle arrays with objects', () => {
    const obj1 = {
      items: [{ id: 1, name: 'test' }],
    }

    const obj2 = {
      items: [{ id: 1, name: 'test' }],
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toBeUndefined()
  })

  /**
   * Test 20: Arrays with different lengths
   * Should detect when array lengths differ
   */
  it('should detect arrays with different lengths', () => {
    const obj1 = {
      values: [1, 2, 3],
    }

    const obj2 = {
      values: [1, 2],
    }

    const result = classObjDiff(obj1, obj2)

    expect(result).toEqual({
      values: [1, 2, 3],
    })
  })
})
