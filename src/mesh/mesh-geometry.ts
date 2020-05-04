import * as PIXI from "pixi.js"

import { Material } from "../material"

export interface MeshGeometryAttribute {
  buffer: ArrayBuffer
  stride: number | undefined
}

export class MeshGeometry extends PIXI.Geometry {
  private _materials: string[] = []

  indices?: MeshGeometryAttribute
  positions?: MeshGeometryAttribute
  uvs?: MeshGeometryAttribute[]
  normals?: MeshGeometryAttribute
  tangents?: MeshGeometryAttribute
  weights?: number[]
  morphTargets?: {
    positions?: MeshGeometryAttribute
    normals?: MeshGeometryAttribute
    tangents?: MeshGeometryAttribute
  }[]

  addAttribute(id: string, buffer?: PIXI.Buffer | number[], size?: number, normalized?: boolean, type?: number, stride?: number, start?: number): MeshGeometry {
    if (this.getAttribute(id)) {
      return this
    }
    return <MeshGeometry>super.addAttribute(
      id, buffer, size, normalized, type, stride, start)
  }

  addIndex(buffer?: PIXI.Buffer | number[]) {
    if (this.getIndex()) {
      return this
    }
    return <MeshGeometry>super.addIndex(buffer)
  }

  addMaterialAttributes(material: Material) {
    material.addGeometryAttributes(this)
    this._materials.push(material.name)
  }

  hasMaterialAttributes(material: Material) {
    return this._materials.indexOf(material.name) >= 0
  }
}