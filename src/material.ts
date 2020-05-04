import * as PIXI from "pixi.js"

import { Mesh3D } from "./mesh/mesh"
import { MeshGeometry } from "./mesh/mesh-geometry"

/**
 * Factory for creating materials.
 */
export interface MaterialFactory {
  /** Creates a new material from the specified source. */
  create(source: unknown): Material
}

/**
 * Materials are used to render a single mesh.
 */
export abstract class Material {
  protected _shader?: PIXI.Shader

  /** State used to render a mesh. */
  state = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  /** Value indicating if the material is valid to render. */
  get valid() {
    return true
  }

  /** Draw mode used to render a mesh. */
  drawMode = PIXI.DRAW_MODES.TRIANGLES

  /** Value indicating if the material is transparent. */
  transparent = false

  get name() {
    return "material"
  }

  /**
   * Creates a shader used to render a mesh.
   * @param mesh Mesh to use.
   * @param renderer Renderer to use.
   */
  abstract createShader(mesh: Mesh3D, renderer: PIXI.Renderer): PIXI.Shader

  /**
   * Updates the uniforms for the specified shader.
   * @param mesh Mesh to use.
   * @param shader Shader for updating uniforms.
   */
  abstract updateUniforms?(mesh: Mesh3D, shader: PIXI.Shader): void

  addGeometryAttributes(geometry: MeshGeometry) {
    if (geometry.indices) {
      // PIXI seems to have problems using anything other than 
      // gl.UNSIGNED_SHORT or gl.UNSIGNED_INT. Let's convert to UNSIGNED_INT.
      geometry.addIndex(new PIXI.Buffer(new Uint32Array(geometry.indices.buffer)))
    }
    if (geometry.positions) {
      geometry.addAttribute("a_Position", new PIXI.Buffer(geometry.positions.buffer),
        3, false, PIXI.TYPES.FLOAT, geometry.positions.stride)
    }
    if (geometry.uvs && geometry.uvs[0]) {
      geometry.addAttribute("a_UV1", new PIXI.Buffer(geometry.uvs[0].buffer),
        2, false, PIXI.TYPES.FLOAT, geometry.uvs[0].stride)
    }
    if (geometry.normals) {
      geometry.addAttribute("a_Normal", new PIXI.Buffer(geometry.normals.buffer),
        3, false, PIXI.TYPES.FLOAT, geometry.normals.stride)
    }
    if (geometry.tangents) {
      geometry.addAttribute("a_Tangent", new PIXI.Buffer(geometry.tangents.buffer),
        4, false, PIXI.TYPES.FLOAT, geometry.tangents.stride)
    }
  }

  /**
   * Renders the specified mesh.
   * @param mesh Mesh to render.
   * @param renderer Renderer to use.
   */
  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    if (!this.valid) {
      return
    }
    if (!this._shader) {
      this._shader = this.createShader(mesh, renderer)
    }
    if (this.updateUniforms) {
      this.updateUniforms(mesh, this._shader)
    }
    renderer.shader.bind(this._shader, false)
    renderer.state.set(this.state)
    renderer.geometry.bind(mesh.geometry, this._shader)
    renderer.geometry.draw(this.drawMode)
  }
}