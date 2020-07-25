/**
 * Represents a subset of data in a buffer.
 */
export class glTFBufferView {
  constructor(public buffer: Uint32Array | Float32Array | Int8Array | Uint8Array | Int16Array | Uint16Array, public stride = 0) {
  }

  static from(componentType: number, buffer: ArrayBuffer, offset: number, size: number, stride?: number) {
    switch (componentType) {
      case 5125: return new glTFBufferView(
        new Uint32Array(buffer, offset, size), stride)
      case 5126: return new glTFBufferView(
        new Float32Array(buffer, offset, size), stride)
      case 5120: return new glTFBufferView(
        new Int8Array(buffer, offset, size), stride)
      case 5121: return new glTFBufferView(
        new Uint8Array(buffer, offset, size), stride)
      case 5122: return new glTFBufferView(
        new Int16Array(buffer, offset, size), stride)
      case 5123: return new glTFBufferView(
        new Uint16Array(buffer, offset, size), stride)
      default: {
        throw new Error(`PIXI3D: Unknown component type "${componentType}".`)
      }
    }
  }
}