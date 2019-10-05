import { glTFLoader } from "./loader"

const TYPE_SIZES: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

class ArrayBufferFactory {
  constructor(private descriptor: any, private buffers: ArrayBuffer[]) {
  }

  create(attribute: number): ArrayBuffer {
    let bufferView = this.descriptor.bufferViews[attribute]
    let accessor = this.descriptor.accessors[attribute]
    let offset = bufferView.byteOffset || 0
    let size = accessor.count * TYPE_SIZES[accessor.type]
    let buffer = this.buffers[bufferView.buffer]

    switch (accessor.componentType) {
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
    return new Float32Array(0)
  }
}

export class glTFParser {
  private factory: ArrayBufferFactory

  constructor(private descriptor: any, buffers: ArrayBuffer[]) {
    this.factory = new ArrayBufferFactory(descriptor, buffers)
  }

  static from(source: string) {
    let resource = glTFLoader.resources[source]
    if (!resource) {
      throw Error(`PIXI3D: Could not find "${source}", was the file loaded?`)
    }
    return new glTFParser(resource.descriptor, resource.buffers)
  }

  getMeshData() {
    let result = []
    for (let node of this.descriptor.nodes) {
      if (node.mesh === undefined) {
        continue
      }
      let mesh = this.descriptor.meshes[node.mesh]
      result.push({
        indices: this.getIndices(mesh),
        positions: this.getPositions(mesh),
        normals: this.getNormals(mesh)
      })
    }
    return result
  }

  private getPositions(mesh: any) {
    return this.factory.create(mesh.primitives[0].attributes["POSITION"])
  }

  private getIndices(mesh: any) {
    return this.factory.create(mesh.primitives[0].indices)
  }

  private getNormals(mesh: any) {
    return this.factory.create(mesh.primitives[0].attributes["NORMAL"])
  }
}