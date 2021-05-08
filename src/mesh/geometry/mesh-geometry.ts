import * as PIXI from "pixi.js"

import { MeshShader } from "../mesh-shader"
import { MeshGeometryAttribute } from "./mesh-geometry-attribute"
import { MeshGeometryTarget } from "./mesh-geometry-target"

/**
 * Geometry with mesh data (i.e. positions, normals, uvs).
 */
export class MeshGeometry3D {
  private _shaderGeometry: { [id: string]: PIXI.Geometry } = {}

  indices?: MeshGeometryAttribute
  positions?: MeshGeometryAttribute
  uvs?: MeshGeometryAttribute[]
  normals?: MeshGeometryAttribute
  tangents?: MeshGeometryAttribute
  targets?: MeshGeometryTarget[]
  joints?: MeshGeometryAttribute
  weights?: MeshGeometryAttribute

  /**
   * Returns geometry with attributes required by the specified shader.
   * @param shader The shader to use.
   */
  getShaderGeometry(shader: MeshShader) {
    return this._shaderGeometry[shader.name]
  }

  /**
   * Creates geometry with attributes required by the specified shader.
   * @param shader The shader to use.
   * @param instanced Value indicating if the geometry will be instanced.
   */
  addShaderGeometry(shader: MeshShader, instanced: boolean) {
    this._shaderGeometry[shader.name] = shader.createShaderGeometry(this, instanced)
  }

  /**
   * Returns a value indicating if geometry with required attributes has been created the specified shader.
   * @param shader The shader to test.
   * @param instanced Value indicating if the geometry is instanced.
   */
  hasShaderGeometry(shader: MeshShader, instanced: boolean) {
    if (this._shaderGeometry[shader.name]) {
      return !instanced || (instanced && this._shaderGeometry[shader.name].instanced)
    }
    return false
  }

  /**
   * Destroys the geometry and it's used resources.
   */
  destroy() {
    for (let name in this._shaderGeometry) {
      this._shaderGeometry[name].destroy()
    }
    this._shaderGeometry = {}
  }
}