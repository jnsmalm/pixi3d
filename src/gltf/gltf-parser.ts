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
    let hierarchy = this.createHierarchy()
    let scene = this.descriptor.scene || 0
    let model = new Model3D(hierarchy.meshes)
    for (let child of this.descriptor.scenes[scene].nodes) {
      this.addChild(model, child, hierarchy.nodes)
    }
    if (this.descriptor.animations) {
      for (let animation of this.descriptor.animations) {
        model.animations.push(this.createAnimation(animation, hierarchy.nodes))
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

  private createHierarchy() {
    let nodes: Container3D[] = []
    let meshes: Mesh3D[] = []
    for (let node of this.descriptor.nodes) {
      let container = Object.assign(new Container3D(), {
        name: node.name,
        transform: this.createTransform(node)
      })
      nodes.push(container)
      if (node.mesh === undefined) {
        continue
      }
      let mesh = this.descriptor.meshes[node.mesh]
      for (let primitive of mesh.primitives) {
        meshes.push(container.addChild(this.createPrimitive(mesh, primitive)))
      }
    }
    return { nodes, meshes }
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

  public createMesh(index = 0) {
    let result: Mesh3D[] = []
    let mesh = this.descriptor.meshes[index]
    for (let primitive of mesh.primitives) {
      result.push(this.createPrimitive(mesh, primitive))
    }
    return result
  }

  private createPrimitive(mesh: any, primitive: any): Mesh3D {
    let geometry = this.createGeometry(mesh, primitive)
    let factory = this.materialFactory || PhysicallyBasedMaterial
    let material = factory.create(this.createMaterial(primitive))
    return Object.assign(new Mesh3D(geometry, material), {
      name: mesh.name
    })
  }

  private createGeometry(mesh: any, primitive: any): MeshGeometry {
    return Object.assign(new MeshGeometry(), {
      indices: this.getIndices(primitive),
      positions: this.getPositions(primitive),
      uvs: this.getTextureCoordinates(primitive),
      normals: this.getNormals(primitive),
      tangents: this.getTangents(primitive),
      morphTargets: this.getMorphTargets(primitive),
      weights: this.getWeights(mesh, primitive)
    })
  }

  private getPositions(primitive: any) {
    return this.bufferAccessor.createGeometryAttribute(primitive.attributes["POSITION"])
  }

  private getNormals(primitive: any) {
    let attribute = primitive.attributes["NORMAL"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(attribute)
    }
  }

  private getTangents(primitive: any) {
    let attribute = primitive.attributes["TANGENT"]
    if (attribute !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(attribute)
    }
  }

  private getIndices(primitive: any) {
    if (primitive.indices !== undefined) {
      return this.bufferAccessor.createGeometryAttribute(primitive.indices)
    }
  }

  private getTextureCoordinates(primitive: any) {
    let attribute = primitive.attributes["TEXCOORD_0"]
    if (attribute !== undefined) {
      return [this.bufferAccessor.createGeometryAttribute(attribute)]
    }
  }

  private getWeights(mesh: any, primitive: any) {
    if (mesh.weights) {
      return mesh.weights
    }
    let targets = primitive.targets
    if (targets) {
      return targets.map(() => 0)
    }
    return undefined
  }

  private getMorphTargets(primitive: any) {
    let targets = primitive.targets
    if (!targets) {
      return undefined
    }
    let result = []
    for (let i = 0; i < targets.length; i++) {
      let target = {
        positions: this.getTargetAttribute(primitive.targets[i], "POSITION"),
        normals: this.getTargetAttribute(primitive.targets[i], "NORMAL"),
        tangents: this.getTargetAttribute(primitive.targets[i], "TANGENT")
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

  protected createMaterial(primitive: any) {
    if (primitive.material === undefined) {
      return new glTFMaterial()
    }
    return this.materialParser.createMaterial(
      this.descriptor.materials[primitive.material])
  }

  protected createAnimation(animation: any, nodes: Container3D[]) {
    return this.animationParser.createAnimation(animation, nodes)
  }
}