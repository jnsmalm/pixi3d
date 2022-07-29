import { glTFMaterial } from "../../gltf/gltf-material"
import { glTFTexture } from "../../gltf/gltf-texture"
import { TextureTransform } from "../../texture/texture-transform"
import { MaterialRenderSortType } from "../material-render-sort-type"
import { Color } from "../../color"
import { StandardMaterial } from "./standard-material"
import { StandardMaterialAlphaMode } from "./standard-material-alpha-mode"
import { StandardMaterialNormalTexture } from "./standard-material-normal-texture"
import { StandardMaterialOcclusionTexture } from "./standard-material-occlusion-texture"
import { StandardMaterialTexture } from "./standard-material-texture"

export class StandardMaterialFactory {
  create(source: unknown) {
    let material = new StandardMaterial()
    if (!(source instanceof glTFMaterial)) {
      return material
    }
    material.baseColor = Color.from(source.baseColor)
    if (source.baseColorTexture) {
      material.baseColorTexture = new StandardMaterialTexture(
        source.baseColorTexture.baseTexture, source.baseColorTexture.texCoord)
      material.baseColorTexture.transform =
        this.createTextureTransform(source.baseColorTexture)
    }
    material.metallic = source.metallic
    material.roughness = source.roughness
    if (source.metallicRoughnessTexture) {
      material.metallicRoughnessTexture = new StandardMaterialTexture(
        source.metallicRoughnessTexture.baseTexture, source.metallicRoughnessTexture.texCoord)
      material.metallicRoughnessTexture.transform =
        this.createTextureTransform(source.metallicRoughnessTexture)
    }
    material.emissive = Color.from(source.emissiveFactor)
    if (source.emissiveTexture) {
      material.emissiveTexture = new StandardMaterialTexture(
        source.emissiveTexture.baseTexture, source.emissiveTexture.texCoord)
      material.emissiveTexture.transform =
        this.createTextureTransform(source.emissiveTexture)
    }
    switch (source.alphaMode) {
      case "BLEND": {
        material.alphaMode = StandardMaterialAlphaMode.blend
        material.renderSortType = MaterialRenderSortType.transparent
        break
      }
      case "MASK": {
        material.alphaMode = StandardMaterialAlphaMode.mask
        break
      }
      case "OPAQUE": {
        // Even when the material is "opaque", the default value is set to
        // "blend". This is to make it easier to render transparent objects
        // without having to change the alpha mode.
        material.alphaMode = StandardMaterialAlphaMode.blend
        break
      }
    }
    material.unlit = source.unlit
    material.doubleSided = source.doubleSided
    material.alphaCutoff = source.alphaCutoff
    if (source.normalTexture) {
      material.normalTexture = new StandardMaterialNormalTexture(
        source.normalTexture.baseTexture, source.normalTexture.scale, source.normalTexture.texCoord)
      material.normalTexture.transform =
        this.createTextureTransform(source.normalTexture)
    }
    if (source.occlusionTexture) {
      material.occlusionTexture = new StandardMaterialOcclusionTexture(
        source.occlusionTexture.baseTexture, source.occlusionTexture.strength, source.occlusionTexture.texCoord)
      material.occlusionTexture.transform =
        this.createTextureTransform(source.occlusionTexture)
    }
    return material
  }

  createTextureTransform(texture: glTFTexture) {
    if (texture.transform) {
      const transform = new TextureTransform()
      if (texture.transform.offset) {
        transform.offset.x = texture.transform.offset[0]
        transform.offset.y = texture.transform.offset[1]
      }
      if (texture.transform.rotation !== undefined) {
        transform.rotation = texture.transform.rotation
      }
      if (texture.transform.scale) {
        transform.scale.x = texture.transform.scale[0]
        transform.scale.y = texture.transform.scale[1]
      }
      return transform
    }
  }
}