import { Shader, State, Geometry, Buffer, Renderer } from "@pixi/core"
import { DRAW_MODES } from "@pixi/constants"
import { Mesh3D } from "./mesh"
import { MeshGeometry3D } from "./geometry/mesh-geometry"

/**
 * Shader used specifically to render a mesh.
 */
export class MeshShader extends Shader {
  private _state = Object.assign(new State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  /** The name of the mesh shader. Used for figuring out if geometry attributes is compatible with the shader. This needs to be set to something different than default value when custom attributes is used. */
  get name() {
    return "mesh-shader"
  }

  /**
   * Creates geometry with required attributes used by this shader. Override when using custom attributes.
   * @param geometry The geometry with mesh data.
   * @param instanced Value indicating if the geometry will be instanced.
   */
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
        3, geometry.positions.normalized, geometry.positions.componentType, geometry.positions.stride)
    }
    if (geometry.uvs && geometry.uvs[0]) {
      result.addAttribute("a_UV1", new Buffer(geometry.uvs[0].buffer),
        2, geometry.uvs[0].normalized, geometry.uvs[0].componentType, geometry.uvs[0].stride)
    }
    if (geometry.normals) {
      result.addAttribute("a_Normal", new Buffer(geometry.normals.buffer),
        3, geometry.normals.normalized, geometry.normals.componentType, geometry.normals.stride)
    }
    if (geometry.tangents) {
      result.addAttribute("a_Tangent", new Buffer(geometry.tangents.buffer),
        4, geometry.tangents.normalized, geometry.tangents.componentType, geometry.tangents.stride)
    }
    if (geometry.colors) {
      result.addAttribute("a_Color", new Buffer(geometry.colors.buffer),
        geometry.colors.componentCount, geometry.colors.normalized, geometry.colors.componentType, geometry.colors.stride)
    }
    return result
  }

  /**
   * Renders the geometry of the specified mesh.
   * @param mesh Mesh to render.
   * @param renderer Renderer to use.
   * @param state Rendering state to use.
   * @param drawMode Draw mode to use.
   */
  render(mesh: Mesh3D, renderer: Renderer, state: State = this._state, drawMode = DRAW_MODES.TRIANGLES) {
    const instanceCount = mesh.instances.filter(i =>
      i.worldVisible && i.renderable).length
    const instancing = mesh.instances.length > 0
    if (!mesh.geometry.hasShaderGeometry(this, instancing)) {
      mesh.geometry.addShaderGeometry(this, instancing)
    }
    let geometry = mesh.geometry.getShaderGeometry(this)
    renderer.shader.bind(this, false)
    renderer.state.set(state)
    renderer.geometry.bind(geometry, this)
    renderer.geometry.draw(drawMode, undefined, undefined, instanceCount)
  }
}