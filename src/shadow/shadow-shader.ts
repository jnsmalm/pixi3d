import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { MeshShader } from "../mesh/mesh-shader"
import { StandardShaderSource } from "../material/standard/standard-shader-source"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"

export class ShadowShader extends MeshShader {
  constructor(features: string[] = []) {
    let vert = require("./shader/shadow.vert").default
    let frag = require("./shader/shadow.frag").default
    super(PIXI.Program.from(
      StandardShaderSource.build(vert, features),
      StandardShaderSource.build(frag, features)))
  }

  createShaderGeometry(geometry: MeshGeometry3D) {
    let result = new PIXI.Geometry()
    if (geometry.indices) {
      // PIXI seems to have problems using anything other than 
      // gl.UNSIGNED_SHORT or gl.UNSIGNED_INT. Let's convert to UNSIGNED_INT.
      result.addIndex(new PIXI.Buffer(new Uint32Array(geometry.indices.buffer)))
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