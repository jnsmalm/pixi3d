import * as PIXI from "pixi.js"

/**
 * glTF defines materials using a common set of parameters that are based on 
 * widely used material representations from Physically-Based Rendering (PBR).
 */
export class glTFMaterial {
  alphaCutoff = 0.5
  alphaMode = "OPAQUE"
  doubleSided = false
  roughness = 1
  metallic = 1
  baseColorTexture?: PIXI.Texture
  metallicRoughnessTexture?: PIXI.Texture
  normalTexture?: PIXI.Texture
  occlusionTexture?: PIXI.Texture
  emissiveTexture?: PIXI.Texture
  emissive = [0, 0, 0]
  baseColor = [1, 1, 1, 1]
}