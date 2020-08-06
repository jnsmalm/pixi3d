import { glTFChannel } from "./animation/gltf-channel"
import { glTFAsset } from "./gltf-asset"
import { glTFAnimation } from "./animation/gltf-animation"
import { glTFBufferView } from "./gltf-buffer-view"
import { glTFMaterial } from "./gltf-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { Material } from "../material/material"
import { MaterialFactory } from "../material/material-factory"
import { StandardMaterial } from "../material/standard/standard-material"
import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { Model3D } from "../model"
import { TransformMatrix } from "../transform/transform-matrix"

const sizes: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

/**
 * Parses glTF assets and creates models and meshes.
 */
export class glTFParser {
  private _asset: glTFAsset
  private _materialFactory: MaterialFactory
  private _descriptor: any

  /**
   * Creates a new parser using the specified asset.
   * @param asset The asset to parse.
   * @param materialFactory The material factory to use.
   */
  constructor(asset: glTFAsset, materialFactory?: MaterialFactory) {
    this._asset = asset
    this._materialFactory = materialFactory || StandardMaterial
    this._descriptor = this._asset.descriptor
  }

  /**
   * Creates a model from the specified asset.
   * @param asset The asset to create the model from.
   * @param materialFactory The material factory to use.
   */
  static createModel(asset: glTFAsset, materialFactory?: MaterialFactory) {
    return new glTFParser(asset, materialFactory).parseModel()
  }

  /**
   * Creates a mesh from the specified asset.
   * @param asset The asset to create the mesh from.
   * @param materialFactory The material factory to use.
   * @param mesh The mesh index in the JSON descriptor.
   */
  static createMesh(asset: glTFAsset, materialFactory?: MaterialFactory, mesh = 0) {
    return new glTFParser(asset, materialFactory).parseMesh(mesh)
  }

  /**
   * Creates a new buffer view from the specified accessor.
   * @param accessor The accessor object or index.
   */
  parseBuffer(accessor: any) {
    if (accessor === undefined) { return undefined }
    if (typeof accessor === "number") {
      accessor = this._asset.descriptor.accessors[accessor]
    }
    let bufferView = this._descriptor.bufferViews[accessor.bufferView || 0]
    let offset = accessor.byteOffset || 0
    if (bufferView.byteOffset !== undefined) {
      offset += bufferView.byteOffset
    }
    let size = accessor.count * sizes[accessor.type]
    if (bufferView.byteStride !== undefined) {
      size *= bufferView.byteStride / 4 / sizes[accessor.type]
    }
    let buffer = this._asset.buffers[bufferView.buffer]

    return glTFBufferView.from(
      accessor.componentType, buffer, offset, size, bufferView.byteStride)
  }

  /**
   * Creates an animation from the specified animation.
   * @param animation The source animation object or index.
   * @param nodes The array of nodes which are potential targets for the animation.
   */
  parseAnimation(animation: any, nodes: Container3D[]) {
    if (typeof animation === "number") {
      animation = this._asset.descriptor.animations[animation]
    }
    let result = new glTFAnimation(animation.name)

    for (let channel of animation.channels) {
      let sampler = animation.samplers[channel.sampler]
      let input = this.parseBuffer(sampler.input)
      if (input === undefined) {
        continue
      }
      let output = this.parseBuffer(sampler.output)
      if (output === undefined) {
        continue
      }
      let animationChannel = glTFChannel.from(
        input.buffer, output.buffer, sampler.interpolation, channel.target.path, nodes[channel.target.node])
      if (animationChannel) {
        result.channels.push(animationChannel)
      }
    }
    return result
  }

  /**
   * Creates a material from the specified material.
   * @param material The source material object or index.
   */
  parseMaterial(material?: any) {
    if (typeof material === "number") {
      material = this._asset.descriptor.materials[material]
    }
    let result = new glTFMaterial()
    if (!material) {
      return this._materialFactory.create(result)
    }
    result.occlusionTexture = this.parseTexture(material.occlusionTexture)
    result.normalTexture = this.parseTexture(material.normalTexture)
    result.emissiveTexture = this.parseTexture(material.emissiveTexture)

    if (material.doubleSided !== undefined) {
      result.doubleSided = material.doubleSided
    }
    if (material.emissive) {
      result.emissive = material.emissive
    }
    if (material.alphaMode) {
      result.alphaMode = material.alphaMode
    }
    if (material.alphaCutoff !== undefined) {
      result.alphaCutoff = material.alphaCutoff
    }
    let pbr = material.pbrMetallicRoughness
    result.metallicRoughnessTexture = this.parseTexture(pbr?.metallicRoughnessTexture)
    if (pbr?.baseColorFactor) {
      result.baseColor = pbr.baseColorFactor
    }
    result.baseColorTexture = this.parseTexture(pbr?.baseColorTexture)
    if (result.baseColorTexture) {
      result.baseColorTexture.baseTexture.alphaMode =
        PIXI.ALPHA_MODES.PREMULTIPLIED_ALPHA
    }
    if (pbr?.metallicFactor !== undefined) {
      result.metallic = pbr.metallicFactor
    }
    if (pbr?.roughnessFactor !== undefined) {
      result.roughness = pbr.roughnessFactor
    }
    if (material.extensions) {
      result.unlit = material.extensions["KHR_materials_unlit"] != undefined
    }
    return this._materialFactory.create(result)
  }

  /**
   * Returns the texture used by the specified object.
   * @param source The source object or index.
   */
  parseTexture(source: any) {
    if (source === undefined) { return undefined }
    if (typeof source === "number") {
      source = { index: source }
    }
    return this._asset.images[this._descriptor.textures[source.index].source]
  }

  /**
   * Creates an array of meshes from the specified mesh.
   * @param mesh The source mesh object or index.
   * @returns An array which contain arrays of meshes. This is because of the 
   * structure used in glTF, where each mesh contain a number of primitives. 
   * Read more about this in discussion at https://github.com/KhronosGroup/glTF/issues/821
   */
  parseMesh(mesh: any) {
    if (typeof mesh === "number") {
      mesh = this._asset.descriptor.meshes[mesh]
    }
    let weights = mesh.weights || []
    return <Mesh3D[]>mesh.primitives.map((primitive: any) => {
      return Object.assign<Mesh3D, Partial<Mesh3D>>(this.parsePrimitive(primitive), {
        name: mesh.name,
        morphWeights: weights
      })
    })
  }

  /**
   * Creates a mesh from the specified primitive.
   * @param primitive The source primitive object.
   */
  parsePrimitive(primitive: any) {
    let { attributes, targets } = primitive

    let geometry = Object.assign<MeshGeometry3D, Partial<MeshGeometry3D>>(new MeshGeometry3D(), {
      indices: this.parseBuffer(primitive.indices),
      positions: this.parseBuffer(attributes["POSITION"]),
      normals: this.parseBuffer(attributes["NORMAL"]),
      tangents: this.parseBuffer(attributes["TANGENT"]),
    })
    for (let i = 0; true; i++) {
      let buffer = this.parseBuffer(attributes[`TEXCOORD_${i}`])
      if (buffer === undefined) {
        break
      }
      geometry.uvs = geometry.uvs || []
      geometry.uvs.push(buffer)
    }
    if (targets) {
      for (let i = 0; i < targets.length; i++) {
        geometry.targets = geometry.targets || []
        geometry.targets.push({
          positions: this.parseBuffer(targets[i]["POSITION"]),
          normals: this.parseBuffer(targets[i]["NORMAL"]),
          tangents: this.parseBuffer(targets[i]["TANGENT"])
        })
      }
    }
    let material: Material
    if (primitive.material !== undefined) {
      material = this.parseMaterial(
        this._asset.descriptor.materials[primitive.material])
    } else {
      material = this.parseMaterial()
    }
    return new Mesh3D(geometry, material)
  }

  /**
   * Creates a container from the specified node.
   * @param node The source node object or index.
   */
  parseNode(node: any) {
    if (typeof node === "number") {
      node = this._asset.descriptor.nodes[node]
    }
    let container = Object.assign<Container3D, Partial<Container3D>>(new Container3D(), {
      name: node.name
    })
    if (node.translation) {
      container.position.set(
        node.translation[0], node.translation[1], node.translation[2]
      )
    }
    if (node.rotation) {
      container.rotationQuaternion.set(
        node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]
      )
    }
    if (node.scale) {
      container.scale.set(node.scale[0], node.scale[1], node.scale[2])
    }
    if (node.matrix) {
      container.transform.setFromMatrix(new TransformMatrix(node.matrix))
    }
    return <Container3D>container
  }

  parseModel() {
    let nodes = <Container3D[]>this._descriptor.nodes.map((n: any) => {
      return this.parseNode(n)
    })
    let scene = this._descriptor.scenes[this._asset.descriptor.scene || 0]
    let model = new Model3D()

    let createHierarchy = (parent: Container3D, node: number) => {
      let mesh = this._asset.descriptor.nodes[node].mesh
      if (mesh !== undefined) {
        for (let primitive of this.parseMesh(mesh)) {
          model.meshes.push(nodes[node].addChild(primitive))
        }
      }
      parent.addChild(nodes[node])
      if (!this._asset.descriptor.nodes[node].children) {
        return
      }
      for (let child of this._asset.descriptor.nodes[node].children) {
        createHierarchy(nodes[node], child)
      }
    }
    for (let node of scene.nodes) {
      createHierarchy(model, node)
    }
    if (this._asset.descriptor.animations) {
      for (let animation of this._asset.descriptor.animations) {
        model.animations.push(this.parseAnimation(animation, nodes))
      }
    }
    return model
  }
}