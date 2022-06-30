import { Texture, BaseTexture } from "@pixi/core"
import { ALPHA_MODES, WRAP_MODES } from "@pixi/constants"

import { glTFChannel } from "./animation/gltf-channel"
import { glTFAsset } from "./gltf-asset"
import { glTFAnimation } from "./animation/gltf-animation"
import { glTFAttribute } from "./gltf-attribute"
import { glTFMaterial } from "./gltf-material"
import { Mesh3D } from "../mesh/mesh"
import { Container3D } from "../container"
import { Material } from "../material/material"
import { MaterialFactory } from "../material/material-factory"
import { StandardMaterial } from "../material/standard/standard-material"
import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { Model } from "../model"
import { Matrix4 } from "../transform/matrix4"
import { Skin } from "../skinning/skin"
import { Joint } from "../skinning/joint"

/**
 * Parses glTF assets and creates models and meshes.
 */
export class glTFParser {
  private _asset: glTFAsset
  private _materialFactory: MaterialFactory
  private _descriptor: any
  private _textures: Texture[] = []

  /**
   * Creates a new parser using the specified asset.
   * @param asset The asset to parse.
   * @param materialFactory The material factory to use.
   */
  constructor(asset: glTFAsset, materialFactory?: MaterialFactory) {
    this._asset = asset
    this._materialFactory = materialFactory || StandardMaterial
    this._descriptor = this._asset.descriptor
    for (let i = 0; i < this._descriptor.textures?.length; i++) {
      this._textures.push(this.parseTexture(i))
    }
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
    let size = accessor.count * componentCount[accessor.type]
    if (bufferView.byteStride !== undefined && bufferView.byteStride !== 0) {
      size = bufferView.byteStride / componentSize[accessor.componentType] * (accessor.count - 1) + componentCount[accessor.type]
    }
    let buffer = this._asset.buffers[bufferView.buffer]

    return glTFAttribute.from(
      accessor.componentType, buffer, offset, size, bufferView.byteStride, accessor.min, accessor.max)
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
    let channels: glTFChannel[] = []
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
        input.buffer, output.buffer, sampler.interpolation || "LINEAR", channel.target.path, nodes[channel.target.node])
      if (animationChannel) {
        channels.push(animationChannel)
      }
    }
    return new glTFAnimation(channels, animation.name)
  }

  /**
   * Creates a material from the specified source.
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
    if (material.occlusionTexture !== undefined) {
      result.occlusionTexture = this._textures[material.occlusionTexture.index].clone()
      result.occlusionTexture.strength = material.occlusionTexture.strength
      result.occlusionTexture.texCoord = material.occlusionTexture.texCoord
      if (material.occlusionTexture.extensions && material.occlusionTexture.extensions.KHR_texture_transform) {
        result.occlusionTexture.transform = material.occlusionTexture.extensions.KHR_texture_transform
        if (material.occlusionTexture.extensions.KHR_texture_transform.texCoord !== undefined) {
          result.occlusionTexture.texCoord = material.occlusionTexture.extensions.KHR_texture_transform.texCoord
        }
      }
    }
    if (material.normalTexture !== undefined) {
      result.normalTexture = this._textures[material.normalTexture.index].clone()
      result.normalTexture.scale = material.normalTexture.scale || 1
      result.normalTexture.texCoord = material.normalTexture.texCoord
      if (material.normalTexture.extensions && material.normalTexture.extensions.KHR_texture_transform) {
        result.normalTexture.transform = material.normalTexture.extensions.KHR_texture_transform
        if (material.normalTexture.extensions.KHR_texture_transform.texCoord !== undefined) {
          result.normalTexture.texCoord = material.normalTexture.extensions.KHR_texture_transform.texCoord
        }
      }
    }
    if (material.emissiveTexture !== undefined) {
      result.emissiveTexture = this._textures[material.emissiveTexture.index].clone()
      result.emissiveTexture.texCoord = material.emissiveTexture.texCoord
      if (material.emissiveTexture.extensions && material.emissiveTexture.extensions.KHR_texture_transform) {
        result.emissiveTexture.transform = material.emissiveTexture.extensions.KHR_texture_transform
        if (material.emissiveTexture.extensions.KHR_texture_transform.texCoord !== undefined) {
          result.emissiveTexture.texCoord = material.emissiveTexture.extensions.KHR_texture_transform.texCoord
        }
      }
    }
    if (material.doubleSided !== undefined) {
      result.doubleSided = material.doubleSided
    }
    if (material.emissiveFactor) {
      result.emissiveFactor = material.emissiveFactor
    }
    if (material.alphaMode) {
      result.alphaMode = material.alphaMode
    }
    if (material.alphaCutoff !== undefined) {
      result.alphaCutoff = material.alphaCutoff
    }
    let pbr = material.pbrMetallicRoughness
    if (pbr?.metallicRoughnessTexture !== undefined) {
      result.metallicRoughnessTexture = this._textures[pbr.metallicRoughnessTexture.index].clone()
      result.metallicRoughnessTexture.texCoord = pbr.metallicRoughnessTexture.texCoord
      if (pbr.metallicRoughnessTexture.extensions && pbr.metallicRoughnessTexture.extensions.KHR_texture_transform) {
        result.metallicRoughnessTexture.transform = pbr.metallicRoughnessTexture.extensions.KHR_texture_transform
        if (pbr.metallicRoughnessTexture.extensions.KHR_texture_transform.texCoord !== undefined) {
          result.metallicRoughnessTexture.texCoord = pbr.metallicRoughnessTexture.extensions.KHR_texture_transform.texCoord
        }
      }
    }
    if (pbr?.baseColorFactor) {
      result.baseColor = pbr.baseColorFactor
    }
    if (pbr?.baseColorTexture !== undefined) {
      result.baseColorTexture = this._textures[pbr.baseColorTexture.index].clone()
      result.baseColorTexture.texCoord = pbr.baseColorTexture.texCoord
      if (pbr.baseColorTexture.extensions && pbr.baseColorTexture.extensions.KHR_texture_transform) {
        result.baseColorTexture.transform = pbr.baseColorTexture.extensions.KHR_texture_transform
        if (pbr.baseColorTexture.extensions.KHR_texture_transform.texCoord !== undefined) {
          result.baseColorTexture.texCoord = pbr.baseColorTexture.extensions.KHR_texture_transform.texCoord
        }
      }
    }
    if (pbr?.metallicFactor !== undefined) {
      result.metallic = pbr.metallicFactor
    }
    if (pbr?.roughnessFactor !== undefined) {
      result.roughness = pbr.roughnessFactor
    }
    if (material.extensions) {
      result.unlit = material.extensions["KHR_materials_unlit"] !== undefined
    }
    return this._materialFactory.create(result)
  }

  /**
   * Returns the texture used by the specified object.
   * @param source The source object or index.
   */
  parseTexture(index: number) {
    const texture = this._descriptor.textures[index]
    const image = this._asset.images[texture.source]
    const result = new Texture(new BaseTexture(image.baseTexture.resource, {
      wrapMode: WRAP_MODES.REPEAT,
      // Went back and forth about NO_PREMULTIPLIED_ALPHA. The default in
      // PixiJS is to have premultiplied alpha textures, but this may not work
      // so well when rendering objects as opaque (which have alpha equal to 0).
      // In that case it's impossible to retrieve the original RGB values, 
      // because they are all zero when using premultiplied alpha. Both the glTF
      // Sample Viewer and Babylon.js uses NO_PREMULTIPLIED_ALPHA so decided to
      // do the same.
      alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA
    }))
    if (this._descriptor.samplers && texture.sampler !== undefined) {
      const sampler = this._descriptor.samplers[texture.sampler]
      switch (sampler.wrapS) {
        case 10497: result.baseTexture.wrapMode = WRAP_MODES.REPEAT; break
        case 33648: result.baseTexture.wrapMode = WRAP_MODES.MIRRORED_REPEAT; break
        case 33071: result.baseTexture.wrapMode = WRAP_MODES.CLAMP; break
      }
    }
    return result
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
        targetWeights: weights
      })
    })
  }

  /**
   * Creates a skin from the specified source.
   * @param skin The source skin object or index.
   * @param target The target container for the skin.
   * @param nodes The array of nodes which are potential targets for the animation.
   */
  parseSkin(skin: any, target: Container3D, nodes: Container3D[]) {
    if (typeof skin === "number") {
      skin = this._asset.descriptor.skins[skin]
    }
    return new Skin(target,
      skin.joints.map((joint: number) => <Joint>nodes[joint]))
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
      joints: this.parseBuffer(attributes["JOINTS_0"]),
      weights: this.parseBuffer(attributes["WEIGHTS_0"]),
      colors: this.parseBuffer(attributes["COLOR_0"])
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
   * Creates a container or joint from the specified node index.
   * @param node The index of the node.
   */
  parseNode(index: number) {
    const node = this._asset.descriptor.nodes[index]
    let joint: Joint | undefined
    for (let skin of this._asset.descriptor.skins || []) {
      const i = skin.joints.indexOf(index)
      if (i >= 0) {
        // This node is a joint
        const inverseBindMatrices = this.parseBuffer(skin.inverseBindMatrices)
        const inverseBindMatrix = <Float32Array>inverseBindMatrices?.buffer.slice(i * 16, i * 16 + 16)
        joint = Object.assign<Joint, Partial<Joint>>(new Joint(inverseBindMatrix), {
          name: node.name
        })
      }
    }
    let container = joint || Object.assign<Container3D, Partial<Container3D>>(new Container3D(), {
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
      container.transform.setFromMatrix(new Matrix4(node.matrix))
    }
    return <Container3D>container
  }

  parseModel() {
    let nodes = <Container3D[]>this._descriptor.nodes.map((n: any, i: number) => {
      return this.parseNode(i)
    })
    let scene = this._descriptor.scenes[this._asset.descriptor.scene || 0]
    let model = new Model()

    let createHierarchy = (parent: Container3D, node: number) => {
      let mesh = this._asset.descriptor.nodes[node].mesh
      let skin: Skin | undefined
      if (this._asset.descriptor.nodes[node].skin !== undefined) {
        skin = this.parseSkin(this._asset.descriptor.nodes[node].skin, nodes[node], nodes)
      }

      if (mesh !== undefined) {
        for (let primitive of this.parseMesh(mesh)) {
          model.meshes.push(nodes[node].addChild(primitive))
          model.meshes[model.meshes.length - 1].skin = skin
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

const componentCount: { [name: string]: number } = {
  SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16
}

const componentSize: { [name: number]: number } = {
  [5120]: 1, [5121]: 1, [5122]: 2, [5123]: 2, [5125]: 4, [5126]: 4
}