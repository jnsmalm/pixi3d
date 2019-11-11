import { glTFResource } from "./gltf-loader"
import { Transform3D } from "../transform"
import { Animation } from "../animation"
import { MetallicRoughnessMaterial, MaterialFactory, Material } from "../material"
import { Model3D } from "../model"
import { Container3D } from "../container"
import { Shader } from "../shader"
import { Mesh3D } from "../mesh"
import { ShaderFactory, DefaultShaderFactory } from "../shader-factory"
import { AttributeData, MeshData, TargetData } from "../mesh-data"
import { glTFMaterialFactory } from "./gltf-material-factory"
import { glTFRotationAnimation } from "./animation/gltf-rotation-animation"
import { glTFTranslationAnimation } from "./animation/gltf-translation-animation"
import { glTFScaleAnimation } from "./animation/gltf-scale-animation"
import { glTFWeightsAnimation } from "./animation/gltf-weights-animation"

export interface glTFParserOptions {
  materialFactory?: MaterialFactory,
  shader?: Shader
  shaderFactory?: ShaderFactory
}

export class glTFParser {
  private factory: ArrayBufferFactory
  private descriptor: any
  private buffers: ArrayBuffer[]

  constructor(public resource: glTFResource, public options: glTFParserOptions = {}) {
    this.descriptor = resource.descriptor
    this.buffers = resource.buffers
    this.factory = new ArrayBufferFactory(this.descriptor, this.buffers)
  }

  createModel() {
    let nodes = this.createNodes()
    let scene = this.descriptor.scene || 0
    let model = new Model3D()
    for (let child of this.descriptor.scenes[scene].nodes) {
      this.addChild(model, child, nodes)
    }
    model.animations = this.createAnimations(nodes)
    return model
  }

  private addChild(parent: Container3D, index: number, nodes: Container3D[]) {
    parent.addChild(nodes[index])
    if (!this.descriptor.nodes[index].children) {
      return
    }
    for (let child of this.descriptor.nodes[index].children) {
      this.addChild(nodes[index], child, nodes)
    }
  }

  private createNodes() {
    let nodes: Container3D[] = []
    for (let node of this.descriptor.nodes) {
      let container = new Container3D(this.createTransform(node))
      nodes.push(container)
      if (node.mesh === undefined) {
        continue
      }
      let mesh = this.createMesh(this.descriptor.meshes[node.mesh])
      container.addChild(mesh)
    }
    return nodes
  }

  private createTransform(node: any) {
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

  private createMesh(mesh: any) {
    let material = this.createMaterial(mesh)
    let data = this.createMeshData(mesh)
    let shader = this.getShader(data, material)
    return new Mesh3D(shader.createGeometry(data), shader, material)
  }

  private getShader(data: MeshData, material: Material) {
    if (this.options.shader) {
      return this.options.shader
    }
    let shaderFactory = this.options.shaderFactory
    if (!shaderFactory) {
      shaderFactory = new DefaultShaderFactory()
    }
    return shaderFactory.createShader(data, material)
  }

  private createMeshData(mesh: any): MeshData {
    return {
      indices: this.getIndices(mesh),
      positions: this.getPositions(mesh),
      normals: this.getNormals(mesh),
      targets: this.getTargets(mesh),
      weights: this.getWeights(mesh),
      texCoords: this.getTexCoords(mesh),
      tangents: this.getTangents(mesh),
    }
  }

  private getPositions(mesh: any) {
    return this.factory.createAttributeData(mesh.primitives[0].attributes["POSITION"])
  }

  private getNormals(mesh: any) {
    let attribute = mesh.primitives[0].attributes["NORMAL"]
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

  private getIndices(mesh: any) {
    if (mesh.primitives[0].indices !== undefined) {
      return this.factory.createAttributeData(mesh.primitives[0].indices)
    }
  }

  private getTexCoords(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private getWeights(mesh: any) {
    if (mesh.weights) {
      return mesh.weights
    }
    let targets = mesh.primitives[0].targets
    if (targets) {
      return targets.map(() => 0)
    }
    return undefined
  }

  private getTargets(mesh: any) {
    let targets = mesh.primitives[0].targets
    if (!targets) {
      return undefined
    }
    let result: TargetData[] = []
    for (let i = 0; i < targets.length; i++) {
      let target: TargetData = {
        positions: this.getTargetAttribute(mesh.primitives[0].targets[i], "POSITION"),
        normals: this.getTargetAttribute(mesh.primitives[0].targets[i], "NORMAL"),
        tangents: this.getTargetAttribute(mesh.primitives[0].targets[i], "TANGENT")
      }
      result.push(target)
    }
    return result
  }

  private getTargetAttribute(target: any, name: string) {
    let attribute = target[name]
    if (attribute) {
      return this.factory.createAttributeData(attribute)
    }
  }

  private createMaterial(mesh: any) {
    if (mesh.primitives[0].material === undefined) {
      return new MetallicRoughnessMaterial()
    }
    let materialFactory = this.options.materialFactory
    if (!materialFactory) {
      materialFactory = new glTFMaterialFactory(this.resource)
    }
    return materialFactory.createMaterial(
      this.descriptor.materials[mesh.primitives[0].material])
  }

  private createAnimations(nodes: Container3D[]) {
    if (!this.descriptor.animations) {
      return []
    }
    let result: Animation[] = []
    for (let animation of this.descriptor.animations) {
      for (let channel of animation.channels) {
        let sampler = animation.samplers[channel.sampler]
        let transform = nodes[channel.target.node].transform
        let mesh = nodes[channel.target.node].children[0].mesh
        let input = this.factory.createAttributeData(sampler.input).buffer as Float32Array
        let output = this.factory.createAttributeData(sampler.output).buffer as Float32Array

        if (channel.target.path === "rotation") {
          result.push(new glTFRotationAnimation(transform, sampler.interpolation, input, output))
        }
        if (channel.target.path === "translation") {
          result.push(new glTFTranslationAnimation(transform, sampler.interpolation, input, output))
        }
        if (channel.target.path === "scale") {
          result.push(new glTFScaleAnimation(transform, sampler.interpolation, input, output))
        }
        if (channel.target.path === "weights") {
          result.push(new glTFWeightsAnimation(mesh.geometry.weights, sampler.interpolation, input, output))
        }
      }
    }
    return result
  }
}

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