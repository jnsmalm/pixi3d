import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { MeshShader } from "../mesh/mesh-shader"
import { StandardShaderSource } from "../material/standard/standard-shader-source"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"

export class ShadowShader extends MeshShader {
  constructor(renderer: PIXI.Renderer, features: string[] = []) {
    let vert = require("./shader/shadow.vert")
    let frag = require("./shader/shadow.frag")

    super(PIXI.Program.from(
      StandardShaderSource.build(vert, features, renderer),
      StandardShaderSource.build(frag, features, renderer)))
  }

  createShaderGeometry(geometry: MeshGeometry3D) {
    let result = new PIXI.Geometry()
    if (geometry.indices) {
      if (geometry.indices.buffer.BYTES_PER_ELEMENT === 1) {
        // PIXI seems to have problems with Uint8Array, let's convert to UNSIGNED_SHORT.
        result.addIndex(new PIXI.Buffer(new Uint16Array(geometry.indices.buffer)))
      } else {
        result.addIndex(new PIXI.Buffer(geometry.indices.buffer))
      }
    }
    if (geometry.positions) {
      result.addAttribute("a_Position", new PIXI.Buffer(geometry.positions.buffer),
        3, false, geometry.positions.componentType, geometry.positions.stride)
    }
    return result
  }

  get name() {
    return "shadow-shader"
  }

  updateUniforms(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    this.uniforms.u_ModelMatrix = mesh.worldTransform.toArray()
    this.uniforms.u_ViewProjectionMatrix = shadowCastingLight.lightViewProjection
  }
}