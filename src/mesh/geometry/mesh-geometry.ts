import * as PIXI from "pixi.js"

import { MeshShader } from "../mesh-shader"
import { MeshGeometryAttribute } from "./mesh-geometry-attribute"
import { MeshGeometryTarget } from "./mesh-geometry-target"

/**
 * Geometry which can add the required attributes for a specific shader.
 */
export class MeshGeometry3D extends PIXI.Geometry {
  private _shaders: string[] = []

  indices?: MeshGeometryAttribute
  positions?: MeshGeometryAttribute
  uvs?: MeshGeometryAttribute[]
  normals?: MeshGeometryAttribute
  tangents?: MeshGeometryAttribute
  targets?: MeshGeometryTarget[]
  joints?: MeshGeometryAttribute
  weights?: MeshGeometryAttribute

  addAttribute(id: string, buffer?: PIXI.Buffer | number[], size?: number, normalized?: boolean, type?: number, stride?: number, start?: number): MeshGeometry3D {
    if (this.getAttribute(id)) {
      return this
    }
    return <MeshGeometry3D>super.addAttribute(
      id, buffer, size, normalized, type, stride, start)
  }

  addIndex(buffer?: PIXI.Buffer | number[]) {
    if (this.getIndex()) {
      return this
    }
    return <MeshGeometry3D>super.addIndex(buffer)
  }

  /**
   * Adds the attributes required by the specified shader.
   * @param shader The shader to use.
   */
  addShaderAttributes(shader: MeshShader) {
    shader.addGeometryAttributes(this)
    this._shaders.push(shader.name)
  }

  /**
   * Returns a value indicating if attributes are compatible with the specified shader.
   * @param shader The shader to test for compatibility.
   */
  hasShaderAttributes(shader: MeshShader) {
    return this._shaders.indexOf(shader.name) >= 0
  }
}