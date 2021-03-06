// @ts-check
const VALUE = Symbol('value');

/**
 * @template T
 */

export default class NonReactive {
  /**
   * @param {T} value
   */
  constructor(value) {
    this[VALUE] = value;
  }

  /**
   * @return {T}
   */
  get value() {
    return this[VALUE];
  }

  /**
   * @param {T} val
   */
  set value(val) {
    this[VALUE] = val;
  }
}
