import { State, Renderer, DRAW_MODES, BLEND_MODES } from "pixi.js"
import { Mesh3D } from "../mesh/mesh"
import { MaterialRenderSortType } from "./material-render-sort-type"
import { MeshShader } from "../mesh/mesh-shader"

/**
 * Materials are used to render a mesh with a specific visual appearance.
 */
export abstract class Material {
  protected _renderSortType = MaterialRenderSortType.opaque
  protected _shader?: MeshShader

  /** State used to render a mesh. */
  state = Object.assign(new State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  /** Draw mode used to render a mesh. */
  drawMode = DRAW_MODES.TRIANGLES

  /**
   * Sort type used to render a mesh. Transparent materials will be rendered
   * after opaque materials.
   */
  renderSortType = MaterialRenderSortType.opaque

  /**
   * Value indicating if writing into the depth buffer is enabled or disabled.
   * Depth mask feature is only available in PixiJS 6.0+ and won't have any 
   * effects in previous versions.
   */
  get depthMask() {
    return this.state.depthMask
  }

  set depthMask(value: boolean) {
    this.state.depthMask = value
  }

  /**
   * Value indicating if the material is double sided. When set to true, the
   * culling state will be set to false.
   */
  get doubleSided() {
    return !this.state.culling
  }

  set doubleSided(value: boolean) {
    this.state.culling = !value
  }

  /** Blend mode used to render a mesh. */
  get blendMode() {
    return this.state.blendMode
  }

  set blendMode(value: BLEND_MODES) {
    this.state.blendMode = value
  }

  /**
   * Creates a shader used to render the specified mesh.
   * @param mesh The mesh to create the shader for.
   * @param renderer The renderer to use.
   */
  abstract createShader(mesh: Mesh3D, renderer: Renderer): MeshShader | undefined

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
   * Returns a value indicating if this material supports instancing.
   */
  get isInstancingSupported() {
    return false
  }

  /**
   * Creates a new instanced version of this material.
   */
  createInstance(): unknown {
    return undefined
  }

  /**
   * Renders the specified mesh.
   * @param mesh The mesh to render.
   * @param renderer The renderer to use.
   */
  render(mesh: Mesh3D, renderer: Renderer) {
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
    this._shader.render(mesh, renderer, this.state, this.drawMode)
  }
}