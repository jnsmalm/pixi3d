import { Transform3D } from "../transform"
import { MaterialFactory } from "../material"
import { Model3D } from "../model"
import { Container3D } from "../container"
import { MeshGeometry } from "../mesh/mesh-geometry"
import { Mesh3D } from "../mesh/mesh"
import { glTFMaterialParser } from "./material-parser"
import { glTFBufferAccessor } from "./buffer-accessor"
import { glTFAnimationParser } from "./animation/parser"
import { glTFResource } from "./gltf-resource"
import { glTFMaterial } from "./gltf-material"
import { PhysicallyBasedMaterial } from "../pbr/pbr-material"

export class glTFParser {
  private bufferAccessor: glTFBufferAccessor
  private animationParser: glTFAnimationParser
  private materialParser: glTFMaterialParser
  private descriptor: any

  constructor(public resource: glTFResource, public materialFactory?: MaterialFactory) {
    this.descriptor = resource.descriptor
    this.bufferAccessor = new glTFBufferAccessor(this.descriptor, resource.buffers)
    this.animationParser = new glTFAnimationParser(resource)
    this.materialParser = new glTFMaterialParser(resource)
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
      let container = new Container3D()
      container.name = node.name
      container.transform = this.createTransform(node)
      nodes.push(container)
      if (node.mesh === undefined) {
        continue
      }
      let mesh = this.createMesh(node.mesh)
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
      transform.rotationQuaternion.set(
        node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]
      )
    }
    return transform
  }

  public createMesh(meshIndex = 0) {
    let mesh = this.descriptor.meshes[meshIndex]
    let sourceMaterial = this.parseMaterial(mesh)
    let geometry = this.createMeshGeometry(mesh)
    let materialFactory = this.materialFactory || PhysicallyBasedMaterial
    let material = materialFactory.create(sourceMaterial)
    return new Mesh3D(geometry, material)
  }

  private createMeshGeometry(mesh: any): MeshGeometry {
    return Object.assign(new MeshGeometry(), {
      indices: this.getIndices(mesh),
      positions: this.getPositions(mesh),
      uvs: this.getTextureCoordinates(mesh),
      normals: this.getNormals(mesh),
      tangents: this.getTangents(mesh),
      morphTargets: this.getMorphTargets(mesh),
      weights: this.getWeights(mesh)
    })
  }

  private getPositions(mesh: any) {
    return this.bufferAccessor.createGeometryAttribute(mesh.primitives[0].attributes["POSITION"])
  }

  private getNormals(mesh: any) {
    let attribute = mesh.primitives[0].attributes["NORMAL"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(attribute)
    }
  }

  private getTangents(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TANGENT"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(attribute)
    }
  }

  private getIndices(mesh: any) {
    if (mesh.primitives[0].indices !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(mesh.primitives[0].indices)
    }
  }

  private getTextureCoordinates(mesh: any) {
    let attribute = mesh.primitives[0].attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return [this.bufferAccessor.createGeometryAttribute(attribute)]
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

  private getMorphTargets(mesh: any) {
    let targets = mesh.primitives[0].targets
    if (!targets) {
      return undefined
    }
    let result = []
    for (let i = 0; i < targets.length; i++) {
      let target = {
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
      return this.bufferAccessor.createGeometryAttribute(attribute)
    }
  }

  protected parseMaterial(mesh: any) {
    if (mesh.primitives[0].material === undefined) {
      return new glTFMaterial()
    }
    return this.materialParser.createMaterial(
      this.descriptor.materials[mesh.primitives[0].material])
  }

  protected createAnimation(animation: any, nodes: Container3D[]) {
    return this.animationParser.createAnimation(animation, nodes)
  }
}