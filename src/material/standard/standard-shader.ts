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

  get name() {
    return "standard-shader"
  }

  addGeometryAttributes(geometry: MeshGeometry3D) {
    super.addGeometryAttributes(geometry)

    if (geometry.targets) {
      for (let i = 0; i < geometry.targets.length; i++) {
        let positions = geometry.targets[i].positions
        if (positions) {
          geometry.addAttribute(`a_Target_Position${i}`, new PIXI.Buffer(positions.buffer),
            3, false, positions.componentType, positions.stride)
        }
        let normals = geometry.targets[i].normals
        if (normals) {
          geometry.addAttribute(`a_Target_Normal${i}`, new PIXI.Buffer(normals.buffer),
            3, false, normals.componentType, normals.stride)
        }
        let tangents = geometry.targets[i].tangents
        if (tangents) {
          geometry.addAttribute(`a_Target_Tangent${i}`, new PIXI.Buffer(tangents.buffer),
            3, false, tangents.componentType, tangents.stride)
        }
      }
    }
    if (geometry.joints) {
      geometry.addAttribute("a_Joint1", new PIXI.Buffer(geometry.joints.buffer),
        4, false, geometry.joints.componentType, geometry.joints.stride)
    }
    if (geometry.weights) {
      geometry.addAttribute("a_Weight1", new PIXI.Buffer(geometry.weights.buffer),
        4, false, geometry.weights.componentType, geometry.weights.stride)
    }
  }
}