/**
 * Represents a color containing RGBA components.
 */
export class Color {
  private _array4: Float32Array
  private _array3: Float32Array

  /**
   * Creates a new color with the specified components (in range 0-1).
   * @param r The R (red) component.
   * @param g The G (green) component.
   * @param b The B (blue) component.
   * @param a The A (alpha) component.
   */
  constructor(r = 0, g = 0, b = 0, a = 1) {
    this._array4 = new Float32Array([r, g, b, a])
    this._array3 = this._array4.subarray(0, 3)
  }

  /**
   * Creates a new color with the specified components (in range 0-255).
   * @param r The R (red) component.
   * @param g The G (green) component.
   * @param b The B (blue) component.
   * @param a The A (alpha) component.
   */
  static fromBytes(r = 0, g = 0, b = 0, a = 255) {
    return new Color(r / 255, g / 255, b / 255, a / 255)
  }

  /**
   * Creates a new color from the specified hex value.
   * @param hex The hex value as a string or a number.
   */
  static fromHex(hex: number | string) {
    if (typeof hex === "string") {
      hex = parseInt(hex.replace(/[^0-9A-F]/gi, ""), 16)
    }
    return Color.fromBytes((hex >> 16) & 255, (hex >> 8) & 255, hex & 255)
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