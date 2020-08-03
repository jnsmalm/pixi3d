import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { MeshShader } from "../../mesh/mesh-shader"
import { StandardShaderSource } from "./standard-shader-source"

export class StandardShader extends MeshShader {
  static build(renderer: PIXI.Renderer, features: string[]) {
    let environment = "webgl1"
    if (renderer.context.webGLVersion === 2) {
      environment = "webgl2"
    }
    let vert = require(`./shader/primitive.${environment}.vert`).default
    let frag = require(`./shader/metallic-roughness.${environment}.frag`).default

    let program = PIXI.Program.from(
      StandardShaderSource.build(vert, features),
      StandardShaderSource.build(frag, features))

    return new StandardShader(program)
  }

  addGeometryAttributes(geometry: MeshGeometry3D) {
    super.addGeometryAttributes(geometry)

    if (geometry.targets) {
      for (let i = 0; i < geometry.targets.length; i++) {
        let positions = geometry.targets[i].positions
        if (positions) {
          let buffer = new PIXI.Buffer(positions.buffer)
          geometry.addAttribute(`a_Target_Position${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, positions.stride)
        }
        let normals = geometry.targets[i].normals
        if (normals) {
          let buffer = new PIXI.Buffer(normals.buffer)
          geometry.addAttribute(`a_Target_Normal${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, normals.stride)
        }
        let tangents = geometry.targets[i].tangents
        if (tangents) {
          let buffer = new PIXI.Buffer(tangents.buffer)
          geometry.addAttribute(`a_Target_Tangent${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, tangents.stride)
        }
      }
    }
  }
}