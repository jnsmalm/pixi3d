import { MaterialAlphaMode, MetallicRoughnessMaterial } from "../material"
import { glTFResource } from "./gltf-resource"

export interface glTFMaterialParser {
  createMaterial(data: any): MetallicRoughnessMaterial
}

export class glTFMetallicRoughnessMaterialParser implements glTFMaterialParser {
  constructor(public resource: glTFResource) {
  }

  createMaterial(data: any) {
    let material = new MetallicRoughnessMaterial()
    if (data.occlusionTexture) {
      material.occlusionTexture = this.getTexture(data.occlusionTexture)
    }
    if (data.normalTexture) {
      material.normalTexture = this.getTexture(data.normalTexture)
    }
    if (data.emissiveTexture) {
      material.emissiveTexture = this.getTexture(data.emissiveTexture)
    }
    if (data.alphaMode) {
      switch (data.alphaMode) {
        case "MASK": {
          material.alphaMode = MaterialAlphaMode.mask
          break
        }
        case "BLEND": {
          material.alphaMode = MaterialAlphaMode.blend
          break
        }
      }
    }
    if (data.alphaCutoff !== undefined) {
      material.alphaMaskCutoff = data.alphaCutoff
    }
    if (data.doubleSided !== undefined) {
      material.doubleSided = data.doubleSided
    }
    let pbr = data.pbrMetallicRoughness
    if (!pbr) {
      return material
    }
    if (pbr.baseColorFactor) {
      material.baseColor = pbr.baseColorFactor
    }
    if (pbr.baseColorTexture) {
      material.baseColorTexture = this.getTexture(pbr.baseColorTexture)
      material.baseColorTexture.baseTexture.alphaMode =
        PIXI.ALPHA_MODES.PREMULTIPLIED_ALPHA
    }
    if (pbr.metallicFactor !== undefined) {
      material.metallic = pbr.metallicFactor
    }
    if (pbr.roughnessFactor !== undefined) {
      material.roughness = pbr.roughnessFactor
    }
    if (pbr.metallicRoughnessTexture) {
      material.metallicRoughnessTexture =
        this.getTexture(pbr.metallicRoughnessTexture)
    }
    return material
  }

  getTexture(data: { index: number }) {
    let texture = this.resource.descriptor.textures[data.index]
    let image = this.resource.images[texture.source]
    image.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
    return image
  }
}