import { glTFLoader } from "./loader"
import { Transform3D } from "../transform"
import { Animation, AnimationInterpolation } from "../animation"
import { ModelData, MeshData, NodeData } from "../data"
import { MetallicRoughnessMaterial } from "../material"

const TYPE_SIZES: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

class ArrayBufferFactory {
  constructor(private descriptor: any, private buffers: ArrayBuffer[]) {
  }

  create(attribute: number): ArrayBuffer {
    let accessor = this.descriptor.accessors[attribute]
    let bufferView = this.descriptor.bufferViews[accessor.bufferView || 0]
    let offset = accessor.byteOffset || 0 + bufferView.byteOffset || 0
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
    throw new Error(`PIXI3D: Failed to crete buffer with "
      ${accessor.componentType}" as component type.`)
  }
}

export class glTFParser {
  private factory: ArrayBufferFactory

  constructor(private descriptor: any, buffers: ArrayBuffer[], private textures: PIXI.Texture[]) {
    this.factory = new ArrayBufferFactory(descriptor, buffers)
  }

  static from(source: string) {
    let resource = glTFLoader.resources[source]
    if (!resource) {
      throw Error(`PIXI3D: Could not find "${source}", was the file loaded?`)
    }
    return new glTFParser(resource.descriptor, resource.buffers, resource.textures)
  }

  getModelData() {
    let result: ModelData = {
      animations: this.getAnimations(),
      nodes: []
    }
    for (let node of this.descriptor.nodes) {
      if (node.mesh === undefined) {
        result.nodes.push({
          transform: this.getTransform(node),
        })
        continue
      }
      let mesh = this.descriptor.meshes[node.mesh]
      let data: MeshData = {
        indices: this.getIndices(mesh),
        positions: this.getPositions(mesh),
        normals: this.getNormals(mesh),
        texCoords: this.getTexCoords(mesh),
        material: this.getMaterial(mesh)
      }
      let modelNode: NodeData = {
        mesh: data,
        transform: this.getTransform(node),
      }
      result.nodes.push(modelNode)
    }
    return result
  }

  private getAnimations() {
    if (!this.descriptor.animations) {
      return []
    }
    let result: Animation[] = []
    for (let animation of this.descriptor.animations) {
      for (let channel of animation.channels) {
        let sampler = animation.samplers[channel.sampler]
        if (sampler.interpolation === AnimationInterpolation.cubicspline) {
          // Cubic spline interpolation is not yet supported, just skip this 
          // animation for now.
          continue
        }
        result.push(new Animation(animation.name,
          channel.target.node, channel.target.path, sampler.interpolation,
          this.factory.create(sampler.input) as Float32Array,
          this.factory.create(sampler.output) as Float32Array
        ))
      }
    }
    return result
  }

  private getTransform(node: any) {
    let transform = new Transform3D()
    if (node.matrix) {
      transform.setFromMatrix(node.matrix)
    }
    if (node.translation) {
      transform.position.set(
        node.translation[0], node.translation[1], node.translation[2]
      )
    }
    if (node.scale) {
      transform.scale.set(
        node.scale[0], node.scale[1], node.scale[2]
      )
    }
    if (node.rotation) {
      transform.rotation.set(
        node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]
      )
    }
    return transform
  }

  private getPositions(mesh: any) {
    return this.factory.create(mesh.primitives[0].attributes["POSITION"])
  }

  private getIndices(mesh: any) {
    if (mesh.primitives[0].indices !== undefined) {
      return this.factory.create(mesh.primitives[0].indices)
    }
  }

  private getNormals(mesh: any) {
    let attribute = mesh.primitives[0].attributes["NORMAL"]
    if (attribute !== undefined) {
      return this.factory.create(attribute)
    }
  }

  private getTexCoords(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return this.factory.create(attribute)
    }
  }

  private getMaterial(mesh: any) {
    let result = new MetallicRoughnessMaterial()
    if (mesh.primitives[0].material === undefined) {
      return result
    }
    let pbrMetallicRoughness = this.descriptor.materials[mesh.primitives[0].material].pbrMetallicRoughness
    if (!pbrMetallicRoughness) {
      return result
    }
    if (pbrMetallicRoughness.baseColorFactor) {
      result.baseColor = pbrMetallicRoughness.baseColorFactor
    }
    if (pbrMetallicRoughness.metallicFactor !== undefined) {
      result.metallic = pbrMetallicRoughness.metallicFactor
    }
    if (pbrMetallicRoughness.roughnessFactor !== undefined) {
      result.roughness = pbrMetallicRoughness.roughnessFactor
    }
    if (pbrMetallicRoughness.baseColorTexture) {
      let texture = pbrMetallicRoughness.baseColorTexture.index
      result.baseColorTexture = this.textures[texture]
      result.baseColorTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    }
    return result
  }
}