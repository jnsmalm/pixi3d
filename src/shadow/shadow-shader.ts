import { Renderer, Program, Geometry, Buffer } from "@pixi/core"
import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { MeshShader } from "../mesh/mesh-shader"
import { StandardShaderSource } from "../material/standard/standard-shader-source"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { Shader as Vertex } from "./shader/shadow.vert"
import { Shader as Fragment } from "./shader/shadow.frag"

export class ShadowShader extends MeshShader {
  constructor(renderer: Renderer, features: string[] = []) {
    super(Program.from(
      StandardShaderSource.build(Vertex.source, features, renderer),
      StandardShaderSource.build(Fragment.source, features, renderer)))
  }

  get maxSupportedJoints() {
    return 0
  }

  createShaderGeometry(geometry: MeshGeometry3D) {
    let result = new Geometry()
    if (geometry.indices) {
      if (geometry.indices.buffer.BYTES_PER_ELEMENT === 1) {
        // PIXI seems to have problems with Uint8Array, let's convert to UNSIGNED_SHORT.
        result.addIndex(new Buffer(new Uint16Array(geometry.indices.buffer)))
      } else {
        result.addIndex(new Buffer(geometry.indices.buffer))
      }
    }
    if (geometry.positions) {
      result.addAttribute("a_Position", new Buffer(geometry.positions.buffer),
        3, false, geometry.positions.componentType, geometry.positions.stride)
    }
    return result
  }

  get name() {
    return "shadow-shader"
  }

  updateUniforms(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    this.uniforms.u_ModelMatrix = mesh.worldTransform.array
    this.uniforms.u_ViewProjectionMatrix = shadowCastingLight.lightViewProjection
  }
}