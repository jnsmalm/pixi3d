import { glTFTexture } from "./gltf-texture"

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
  baseColorTexture?: glTFTexture
  metallicRoughnessTexture?: glTFTexture
  normalTexture?: glTFTexture & { scale?: number }
  occlusionTexture?: glTFTexture & { strength?: number }
  emissiveTexture?: glTFTexture
  emissiveFactor = [0, 0, 0]
  baseColor = [1, 1, 1, 1]
  unlit = false
}