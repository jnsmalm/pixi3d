import { Mesh3D } from "../mesh/mesh"
import { ColorMaterial } from "./color-material"
import { MeshPicker } from "./mesh-picker"

let uid = 1

export class MeshPickerHitArea {
  private _material: ColorMaterial
  private _color: Uint8Array

  constructor(public picker: MeshPicker, public mesh: Mesh3D) {
    const id = uid++

    this._color = new Uint8Array([
      (id >> 16) & 255, (id >> 8) & 255, id & 255
    ])
    this._material = new ColorMaterial(this._color)
  }

  render(renderer: any) {
    this._material.render(this.mesh, renderer)
  }

  contains(x: number, y: number) {
    return this.picker.containsColor(x, y, this._color)
  }
}