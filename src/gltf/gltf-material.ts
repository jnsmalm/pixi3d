import * as PIXI from "pixi.js"

export class glTFMaterial {
  alphaMaskCutoff = 0.5
  alphaMode = "OPAQUE"
  doubleSided = false
  roughness = 1
  metallic = 1
  baseColorTexture?: PIXI.Texture
  metallicRoughnessTexture?: PIXI.Texture
  normalTexture?: PIXI.Texture
  occlusionTexture?: PIXI.Texture
  emissiveTexture?: PIXI.Texture
  baseColor = [1, 1, 1, 1]
}