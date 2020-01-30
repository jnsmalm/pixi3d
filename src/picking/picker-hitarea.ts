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

    let worldTransform = mesh.transform.worldTransform as any
    worldTransform.applyInverse = (a: any, b: any) => {
      // PIXI expects this method to exist and to return the position with the 
      // inverse of the current transformation applied. We want the global 
      // position at all times for the picking to work. So this is a hack to 
      // make PIXI happy.
      b.x = a.x; b.y = a.y
    }

  }

  render(renderer: any) {
    this._material.render(this.mesh, renderer)
  }

  contains(x: number, y: number) {
    return this.picker.containsColor(x, y, this._color)
  }
}