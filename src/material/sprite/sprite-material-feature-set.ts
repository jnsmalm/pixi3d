import { Renderer } from "@pixi/core"
import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../../mesh/mesh"
import { SpriteMaterial } from "./sprite-material"

export namespace SpriteMaterialFeatureSet {
  export function build(renderer: Renderer, mesh: Mesh3D, geometry: MeshGeometry3D, material: SpriteMaterial) {
    let features: string[] = []

    if (mesh.instances.length > 0) {
      features.push("USE_INSTANCING 1")
    }
    if (renderer.context.webGLVersion === 1) {
      features.push("WEBGL1 1")
    }
    if (renderer.context.webGLVersion === 2) {
      features.push("WEBGL2 1")
    }
    if (material.texture) {
      if (material.texture.baseTexture.valid) {
        features.push("HAS_TEXTURE 1")
      }
    }
    return features
  }
}