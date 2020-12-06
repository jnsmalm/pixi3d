import * as PIXI from "pixi.js"

import { Mesh3D } from "../mesh/mesh"
import { MeshShader } from "../mesh/mesh-shader"

/**
 * Materials are used to render a mesh with a specific visual appearance.
 */
export abstract class Material {
  protected _shader?: MeshShader

  /** Draw mode used to render a mesh. */
  drawMode = PIXI.DRAW_MODES.TRIANGLES

  /** Value indicating if the material is transparent. */
  transparent = false

  /** Value indicating if the material is double sided. */
  doubleSided = false

  /**
   * Creates a shader used to render the specified mesh.
   * @param mesh The mesh to create the shader for.
   * @param renderer The renderer to use.
   */
  abstract createShader(mesh: Mesh3D, renderer: PIXI.Renderer): MeshShader | undefined

  /**
   * Updates the uniforms for the specified shader.
   * @param mesh The mesh used for updating the uniforms.
   * @param shader The shader to update.
   */
  abstract updateUniforms?(mesh: Mesh3D, shader: MeshShader): void

  /**
   * Destroys the material and it's used resources.
   */
  destroy() { }

  /**
   * Renders the specified mesh.
   * @param mesh The mesh to render.
   * @param renderer The renderer to use.
   * @param state The state to use.
   */
  render(mesh: Mesh3D, renderer: PIXI.Renderer, state?: PIXI.State) {
    if (!this._shader) {
      this._shader = this.createShader(mesh, renderer)
      if (!this._shader) {
        // The shader couldn't be created for some reason. Just ignore it and 
        // try again at next render. The required assets may not have been loaded 
        // yet, so maybe we are waiting for those.
        return
      }
    }
    if (this.updateUniforms) {
      this.updateUniforms(mesh, this._shader)
    }
    this._shader.render(mesh, renderer, state, this.drawMode)
  }
}