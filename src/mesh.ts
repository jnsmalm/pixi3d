import { Material } from "./material"
import { Container3D } from "./container"
import { MeshPickerHitArea } from "./picking/picker-hitarea"

export interface MeshMorphTarget {
  positions?: MeshAttribute,
  normals?: MeshAttribute,
  tangents?: MeshAttribute
}

export interface MeshAttribute {
  stride: number
  buffer: ArrayBuffer
}

export interface MeshGeometryData {
  indices?: MeshAttribute
  positions: MeshAttribute
  normals?: MeshAttribute
  texCoords?: MeshAttribute
  tangents?: MeshAttribute
  weights?: number[]
  morphTargets?: MeshMorphTarget[]
}

export class Mesh3D extends Container3D {
  pluginName = "sortable"

  constructor(name: string | undefined, public geometry: MeshGeometryData, public material: Material, public weights?: number[]) {
    super(name)
    material.bind(this)
  }

  render(renderer: any) {
    super.render(renderer)
    let meshRenderer = renderer.plugins[this.pluginName]
    if (!meshRenderer) {
      throw new Error(`PIXI3D: Renderer with name "${this.pluginName}" does not exist.`)
    }
    renderer.batch.setObjectRenderer(meshRenderer)
    meshRenderer.render(this)

    let picker = renderer.plugins.picker
    if (picker && this.isInteractive()) {
      if (!this.hitArea) {
        this.hitArea = new MeshPickerHitArea(picker, this)
      }
      picker.add(this)
    }
  }

  isInteractive(object?: any): boolean {
    object = object || this
    if (object.interactive) {
      return true
    }
    if (object.parent) {
      return this.isInteractive(object.parent)
    }
    return false
  }
}