import { MeshGeometryAttribute } from "../mesh/mesh-geometry"

const TYPE_SIZES: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

export class glTFBufferAccessor {
  constructor(private descriptor: any, private buffers: ArrayBuffer[]) {
  }

  private createArrayBuffer(componentType: number, buffer: any, offset: number, size: number): ArrayBuffer {
    switch (componentType) {
      case 5125:
        return new Uint32Array(buffer, offset, size)
      case 5126:
        return new Float32Array(buffer, offset, size)
      case 5120:
        return new Int8Array(buffer, offset, size)
      case 5121:
        return new Uint8Array(buffer, offset, size)
      case 5122:
        return new Int16Array(buffer, offset, size)
      case 5123:
        return new Uint16Array(buffer, offset, size)
    }
    throw new Error(`PIXI3D: Unknown component type "${componentType}".`)
  }

  createGeometryAttribute(attribute: number): MeshGeometryAttribute {
    let accessor = this.descriptor.accessors[attribute]
    let bufferView = this.descriptor.bufferViews[accessor.bufferView || 0]

    let offset = accessor.byteOffset || 0
    if (bufferView.byteOffset !== undefined) {
      offset += bufferView.byteOffset
    }
    let size = accessor.count * TYPE_SIZES[accessor.type]
    if (bufferView.byteStride !== undefined) {
      size *= bufferView.byteStride / 4 / TYPE_SIZES[accessor.type]
    }
    let buffer = this.buffers[bufferView.buffer]

    return {
      stride: bufferView.byteStride || 0,
      buffer: this.createArrayBuffer(accessor.componentType, buffer, offset, size)
    }
  }
}