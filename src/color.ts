/**
 * Represents a color containing RGBA components.
 */
export class Color {
  private _array4: Float32Array
  private _array3: Float32Array

  /**
   * Creates a new color with the specified components.
   * @param r The R (red) component.
   * @param g The G (green) component.
   * @param b The B (blue) component.
   * @param a The A (alpha) component.
   */
  constructor(r = 0, g = 0, b = 0, a = 0) {
    this._array4 = new Float32Array([r, g, b, a])
    this._array3 = this._array4.subarray(0, 3)
  }

  /** The color as an typed array containing RGB. */
  get rgb() {
    return this._array3
  }

  /** The color as an typed array containing RGBA. */
  get rgba() {
    return this._array4
  }

  /** The R (red) component. */
  get r() {
    return this._array4[0]
  }

  set r(value: number) {
    this._array4[0] = value
  }

  /** The G (green) component. */
  get g() {
    return this._array4[1]
  }

  set g(value: number) {
    this._array4[1] = value
  }

  /** The B (blue) component. */
  get b() {
    return this._array4[2]
  }

  set b(value: number) {
    this._array4[2] = value
  }

  /** The A (alpha) component. */
  get a() {
    return this._array4[3]
  }

  set a(value: number) {
    this._array4[3] = value
  }

  /**
   * Creates a new color from the specified source.
   * @param source The source to create the color from.
   */
  static from(source: number[] | Float32Array) {
    return new Color(...source)
  }
}