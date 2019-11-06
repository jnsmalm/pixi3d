export enum MaterialAlphaMode {
  opaque = "opaque",
  mask = "mask",
  blend = "blend"
}

export class MetallicRoughnessMaterial {
  roughness = 1
  metallic = 1
  baseColorTexture?: PIXI.Texture
  metallicRoughnessTexture?: PIXI.Texture
  normalTexture?: PIXI.Texture
  occlusionTexture?: PIXI.Texture
  emissiveTexture?: PIXI.Texture
  baseColor = [1, 1, 1, 1]
  alphaMode = MaterialAlphaMode.opaque
  alphaMaskCutoff = 0.5
  doubleSided = false
}