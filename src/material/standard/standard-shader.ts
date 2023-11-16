import { Program, Renderer, State, Buffer } from "@pixi/core"
import { DRAW_MODES } from "@pixi/constants"

import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { Mesh3D } from "../../mesh/mesh"
import { MeshShader } from "../../mesh/mesh-shader"
import { StandardShaderInstancing } from "./standard-shader-instancing"
import { StandardShaderSource } from "./standard-shader-source"
import { Shader as MetallicRoughness } from "./shader/metallic-roughness.frag"
import { Shader as Primitive } from "./shader/primitive.vert"

export class StandardShader extends MeshShader {
  private _instancing = new StandardShaderInstancing()

  static build(renderer: Renderer, features: string[]) {
    let program = Program.from(
      StandardShaderSource.build(Primitive.source, features, renderer),
      StandardShaderSource.build(MetallicRoughness.source, features, renderer))

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
          result.addAttribute(`a_Target_Position${i}`, new Buffer(positions.buffer),
            3, positions.normalized, positions.componentType, positions.stride)
        }
        let normals = geometry.targets[i].normals
        if (normals) {
          result.addAttribute(`a_Target_Normal${i}`, new Buffer(normals.buffer),
            3, normals.normalized, normals.componentType, normals.stride)
        }
        let tangents = geometry.targets[i].tangents
        if (tangents) {
          result.addAttribute(`a_Target_Tangent${i}`, new Buffer(tangents.buffer),
            3, tangents.normalized, tangents.componentType, tangents.stride)
        }
      }
    }
    if (geometry.uvs && geometry.uvs[1]) {
      result.addAttribute("a_UV2", new Buffer(geometry.uvs[1].buffer),
        2, geometry.uvs[1].normalized, geometry.uvs[1].componentType, geometry.uvs[1].stride)
    }
    if (geometry.joints) {
      result.addAttribute("a_Joint1", new Buffer(geometry.joints.buffer),
        4, geometry.joints.normalized, geometry.joints.componentType, geometry.joints.stride)
    }
    if (geometry.weights) {
      result.addAttribute("a_Weight1", new Buffer(geometry.weights.buffer),
        4, geometry.weights.normalized, geometry.weights.componentType, geometry.weights.stride)
    }
    return result
  }

  render(mesh: Mesh3D, renderer: Renderer, state: State, drawMode: DRAW_MODES) {
    if (mesh.instances.length > 0) {
      const filteredInstances = mesh.instances.filter((instance) => instance.worldVisible && instance.renderable);
      if (filteredInstances.length === 0) {
        //early exit - this avoids us drawing the last known instance in the instance buffer
        return;
      }
      this._instancing.updateBuffers(filteredInstances)
    }
    super.render(mesh, renderer, state, drawMode)
  }
}