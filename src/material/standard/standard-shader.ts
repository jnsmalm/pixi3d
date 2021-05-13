import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../../mesh/mesh"
import { MeshShader } from "../../mesh/mesh-shader"
import { StandardShaderInstancing } from "./standard-shader-instancing"
import { StandardShaderSource } from "./standard-shader-source"

export class StandardShader extends MeshShader {
  private _instancing = new StandardShaderInstancing()

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

  createShaderGeometry(geometry: MeshGeometry3D, instanced: boolean) {
    let result = super.createShaderGeometry(geometry, instanced)
    if (instanced) {
      this._instancing.addGeometryAttributes(result)
    }
    if (geometry.targets) {
      for (let i = 0; i < geometry.targets.length; i++) {
        let positions = geometry.targets[i].positions
        if (positions) {
          result.addAttribute(`a_Target_Position${i}`, new PIXI.Buffer(positions.buffer),
            3, false, positions.componentType, positions.stride)
        }
        let normals = geometry.targets[i].normals
        if (normals) {
          result.addAttribute(`a_Target_Normal${i}`, new PIXI.Buffer(normals.buffer),
            3, false, normals.componentType, normals.stride)
        }
        let tangents = geometry.targets[i].tangents
        if (tangents) {
          result.addAttribute(`a_Target_Tangent${i}`, new PIXI.Buffer(tangents.buffer),
            3, false, tangents.componentType, tangents.stride)
        }
      }
    }
    if (geometry.joints) {
      result.addAttribute("a_Joint1", new PIXI.Buffer(geometry.joints.buffer),
        4, false, geometry.joints.componentType, geometry.joints.stride)
    }
    if (geometry.weights) {
      result.addAttribute("a_Weight1", new PIXI.Buffer(geometry.weights.buffer),
        4, false, geometry.weights.componentType, geometry.weights.stride)
    }
    return result
  }

  render(mesh: Mesh3D, renderer: PIXI.Renderer, state: PIXI.State, drawMode: PIXI.DRAW_MODES) {
    if (mesh.instances.length > 0) {
      this._instancing.updateBuffers(mesh.instances)
    }
    super.render(mesh, renderer, state, drawMode)
  }
}