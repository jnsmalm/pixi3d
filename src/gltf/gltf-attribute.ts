/**
 * Represents data for a specific geometry attribute.
 */
export class glTFAttribute {
  constructor(public buffer: Uint32Array | Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array, public componentType: number, public stride = 0, public componentCount: number, public normalized: boolean = false, public min?: number[], public max?: number[]) {
  }

  static from(componentType: number, componentCount: number, buffer: ArrayBuffer, offset: number, size: number, stride?: number, normalized: boolean = false, min?: number[], max?: number[]) {
    switch (componentType) {
      case 5125: return new glTFAttribute(
        new Uint32Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      case 5126: return new glTFAttribute(
        new Float32Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      case 5120: return new glTFAttribute(
        new Int8Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      case 5121: return new glTFAttribute(
        new Uint8Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      case 5122: return new glTFAttribute(
        new Int16Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      case 5123: return new glTFAttribute(
        new Uint16Array(buffer, offset, size), componentType, stride, componentCount, normalized, min, max)
      default: {
        throw new Error(`PIXI3D: Unknown component type "${componentType}".`)
      }
    }
  }
}