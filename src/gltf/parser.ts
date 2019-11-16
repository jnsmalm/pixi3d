import { glTFResource } from "./loader"
import { Transform3D } from "../transform"
import { MetallicRoughnessMaterial, Material } from "../material"
import { Model3D } from "../model"
import { Container3D } from "../container"
import { Shader } from "../shader"
import { Mesh3D } from "../mesh"
import { ShaderFactory, DefaultShaderFactory } from "../shader-factory"
import { MeshData, TargetData } from "../mesh-data"
import { glTFMetallicRoughnessMaterialParser, glTFMaterialParser } from "./material-parser"
import { glTFBufferAccessor } from "./buffer-accessor"
import { glTFAnimationParser } from "./animation/parser"

export interface glTFParserOptions {
  shader?: Shader
  shaderFactory?: ShaderFactory
}

export class glTFParser {
  private bufferAccessor: glTFBufferAccessor
  private animationParser: glTFAnimationParser
  private materialParser: glTFMaterialParser
  private descriptor: any

  constructor(public resource: glTFResource, public options: glTFParserOptions = {}) {
    this.descriptor = resource.descriptor
    this.bufferAccessor = new glTFBufferAccessor(this.descriptor, resource.buffers)
    this.animationParser = new glTFAnimationParser(resource)
    this.materialParser = new glTFMetallicRoughnessMaterialParser(resource)
  }

  createModel() {
    let nodes = this.createNodes()
    let scene = this.descriptor.scene || 0
    let model = new Model3D()
    for (let child of this.descriptor.scenes[scene].nodes) {
      this.addChild(model, child, nodes)
    }
    if (this.descriptor.animations) {
      for (let animation of this.descriptor.animations) {
        model.animations.push(this.createAnimation(animation, nodes))
      }
    }
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

  protected createMesh(mesh: any) {
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
    return this.bufferAccessor.createAttributeData(mesh.primitives[0].attributes["POSITION"])
  }

  private getNormals(mesh: any) {
    let attribute = mesh.primitives[0].attributes["NORMAL"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createAttributeData(attribute)
    }
  }

  private getTangents(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TANGENT"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createAttributeData(attribute)
    }
  }

  private getIndices(mesh: any) {
    if (mesh.primitives[0].indices !== undefined) {
      return this.bufferAccessor.createAttributeData(mesh.primitives[0].indices)
    }
  }

  private getTexCoords(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createAttributeData(attribute)
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
      return this.bufferAccessor.createAttributeData(attribute)
    }
  }

  protected createMaterial(mesh: any) {
    if (mesh.primitives[0].material === undefined) {
      return new MetallicRoughnessMaterial()
    }
    return this.materialParser.createMaterial(
      this.descriptor.materials[mesh.primitives[0].material])
  }

  protected createAnimation(animation: any, nodes: Container3D[]) {
    return this.animationParser.createAnimation(animation, nodes)
  }
}