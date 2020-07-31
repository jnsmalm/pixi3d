import * as PIXI from "pixi.js"

import { MeshGeometry } from "../mesh/geometry/mesh-geometry"
import { MeshShader } from "../mesh/mesh-shader"

export class PhysicallyBasedMeshShader extends MeshShader {

  static build(renderer: PIXI.Renderer, features: string[]) {
    let environment = "webgl1"
    if (renderer.context.webGLVersion === 2) {
      environment = "webgl2"
    }
    let vert = require(`./shader/primitive.${environment}.vert`).default
    let frag = require(`./shader/metallic-roughness.${environment}.frag`).default

    let program = PIXI.Program.from(
      PhysicallyBasedShaderSource.build(vert, features),
      PhysicallyBasedShaderSource.build(frag, features))

    return new PhysicallyBasedMeshShader(program)
  }

  addShaderAttributes(geometry: MeshGeometry) {
    super.addShaderAttributes(geometry)

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

namespace PhysicallyBasedShaderSource {
  const FEATURES = /#define FEATURES/
  const INCLUDES = /#include <(.+)>/gm

  export function build(source: string, features: string[]) {
    let match: RegExpExecArray | null
    while ((match = INCLUDES.exec(source)) !== null) {
      source = source.replace(match[0], require(`./shader/${match[1]}`).default)
    }
    return source.replace(FEATURES,
      features.map(value => `#define ${value}`).join("\n"))
  }
}