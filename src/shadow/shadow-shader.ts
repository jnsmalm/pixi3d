import { Renderer, Program, Geometry, State, Buffer } from "@pixi/core"
import { MeshGeometry3D } from "../mesh/geometry/mesh-geometry"
import { MeshShader } from "../mesh/mesh-shader"
import { StandardShaderSource } from "../material/standard/standard-shader-source"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { Shader as Vertex } from "./shader/shadow.vert"
import { Shader as Fragment } from "./shader/shadow.frag"
import { ShadowShaderInstancing } from "./shadow-shader-instancing"

export class ShadowShader extends MeshShader {
  private _instancing = new ShadowShaderInstancing();

  constructor(renderer: Renderer, features: string[] = []) {
    super(Program.from(
      StandardShaderSource.build(Vertex.source, features, renderer),
      StandardShaderSource.build(Fragment.source, features, renderer)))
  }

  get maxSupportedJoints() {
    return 0
  }

  createShaderGeometry(geometry: MeshGeometry3D, instanced: boolean) {
    let result = new Geometry()
    if (geometry.indices) {
      if (geometry.indices.buffer.BYTES_PER_ELEMENT === 1) {
        // PixiJS seems to have problems with Uint8Array, let's convert to UNSIGNED_SHORT.
        result.addIndex(new Buffer(new Uint16Array(geometry.indices.buffer)))
      } else {
        result.addIndex(new Buffer(geometry.indices.buffer))
      }
    }
    if (geometry.positions) {
      result.addAttribute("a_Position", new Buffer(geometry.positions.buffer),
        3, false, geometry.positions.componentType, geometry.positions.stride)
    }
    if (instanced) {
      this._instancing.addGeometryAttributes(result)
    }

    return result
  }

  get name() {
    return "shadow-shader"
  }

  render(mesh: Mesh3D, renderer: Renderer, state: State) {
    if (mesh.instances.length > 0) {
      const filteredInstances = mesh.instances.filter((instance) => instance.worldVisible && instance.renderable);
      if (filteredInstances.length === 0) {
        //early exit - this avoids us drawing the last known instance in the instance buffer
        return;
      }
      this._instancing.updateBuffers(filteredInstances)
    }
    super.render(mesh, renderer, state)
  }

  updateUniforms(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    this.uniforms.u_ModelMatrix = mesh.worldTransform.array
    this.uniforms.u_ViewProjectionMatrix = shadowCastingLight.lightViewProjection
  }
}