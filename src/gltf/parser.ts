import { glTFLoader } from "./loader"
import { Transform3D } from "../transform"
import { Animation, AnimationInterpolation, RotationAnimation, TranslationAnimation, ScaleAnimation } from "../animation"
import { MetallicRoughnessMaterial } from "../material"
import { Model3D } from "../model"
import { Container3D } from "../container"
import { Shader, ShaderFactory } from "../shader"
import { MeshData, Mesh3D, AttributeData } from "../mesh"
import { StandardShaderFactory } from "../shaders/standard"

const TYPE_SIZES: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

class ArrayBufferFactory {
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
    throw new Error(`PIXI3D: Failed to create buffer with "${componentType}" as component type.`)
  }

  createAttributeData(attribute: number): AttributeData {
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

export class glTFParser {
  private factory: ArrayBufferFactory

  constructor(private descriptor: any, buffers: ArrayBuffer[], private textures: PIXI.Texture[], private shader?: Shader, private shaderFactory?: ShaderFactory) {
    this.factory = new ArrayBufferFactory(descriptor, buffers)
  }

  private createNodeContainers() {
    let containers: Container3D[] = []
    for (let node of this.descriptor.nodes) {
      let container = new Container3D(this.getTransform(node))
      containers.push(container)
      if (node.mesh === undefined) {
        continue
      }
      let mesh = this.createMesh(this.descriptor.meshes[node.mesh])
      container.addChild(mesh)
    }
    return containers
  }

  private addNodeChildren(parent: Container3D, nodeIndex: number, nodeContainers: Container3D[]) {
    parent.addChild(nodeContainers[nodeIndex])
    if (!this.descriptor.nodes[nodeIndex].children) {
      return
    }
    for (let child of this.descriptor.nodes[nodeIndex].children) {
      this.addNodeChildren(nodeContainers[nodeIndex], child, nodeContainers)
    }
  }

  createModel() {
    let containers = this.createNodeContainers()
    let scene = this.descriptor.scenes[this.descriptor.scene || 0]
    let model = new Model3D()
    for (let node of scene.nodes) {
      this.addNodeChildren(model, node, containers)
    }
    model.animations = this.getAnimations(containers)
    return model
  }

  private createMeshData(mesh: any): MeshData {
    return {
      indices: this.getIndices(mesh),
      positions: this.getPositions(mesh),
      normals: this.getNormals(mesh),
      colors: this.getColors(mesh),
      texCoords: this.getTexCoords(mesh),
      tangents: this.getTangents(mesh)
    }
  }

  private createMesh(mesh: any) {
    let data = this.createMeshData(mesh)
    if (!this.shader) {
      if (!this.shaderFactory) {
        this.shaderFactory = new StandardShaderFactory()
      }
      this.shader = this.shaderFactory.createShader(data)
    }
    return new Mesh3D(
      this.shader.createGeometry(data), this.shader, this.getMaterial(mesh))
  }

  static from(source: string, shader?: Shader, shaderFactory?: ShaderFactory) {
    let resource = glTFLoader.resources[source]
    if (!resource) {
      throw Error(`PIXI3D: Could not find "${source}", was the file loaded?`)
    }
    return new glTFParser(
      resource.descriptor, resource.buffers, resource.textures, shader, shaderFactory)
  }

  private getAnimations(nodes: Container3D[]) {
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
          console.warn(`PIXI3D: Animations with "${sampler.interpolation}" interpolation is currently not supported.`)
          continue
        }
        let transform = nodes[channel.target.node].transform
        let input = this.factory.createAttributeData(sampler.input).buffer as Float32Array
        let output = this.factory.createAttributeData(sampler.output).buffer as Float32Array

        if (channel.target.path === "rotation") {
          result.push(new RotationAnimation(transform, sampler.interpolation, input, output))
        }
        if (channel.target.path === "translation") {
          result.push(new TranslationAnimation(transform, sampler.interpolation, input, output))
        }
        if (channel.target.path === "scale") {
          result.push(new ScaleAnimation(transform, sampler.interpolation, input, output))
        }
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
    return this.factory.createAttributeData(mesh.primitives[0].attributes["POSITION"])
  }

  private getIndices(mesh: any) {
    if (mesh.primitives[0].indices !== undefined) {
      return this.factory.createAttributeData(mesh.primitives[0].indices)
    }
  }

  private getNormals(mesh: any) {
    let attribute = mesh.primitives[0].attributes["NORMAL"]
    if (attribute !== undefined) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private getTexCoords(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private getColors(mesh: any) {
    let attribute = mesh.primitives[0].attributes["COLOR_0"]
    if (attribute !== undefined) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private getTangents(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TANGENT"]
    if (attribute !== undefined) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private getMaterial(mesh: any) {
    let result = new MetallicRoughnessMaterial()
    if (mesh.primitives[0].material === undefined) {
      return result
    }
    let material = this.descriptor.materials[mesh.primitives[0].material]
    if (material.normalTexture) {
      let texture = material.normalTexture.index
      result.normalTexture = this.textures[texture]
      result.normalTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
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
    if (pbrMetallicRoughness.metallicRoughnessTexture) {
      let texture = pbrMetallicRoughness.metallicRoughnessTexture.index
      result.metallicRoughnessTexture = this.textures[texture]
      result.metallicRoughnessTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    }
    return result
  }
}