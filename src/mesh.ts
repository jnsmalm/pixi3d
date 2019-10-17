import { Shader } from "./shader"
import { MetallicRoughnessMaterial } from "./material"
import { Container3D } from "./container"

const state = new PIXI.State()
state.culling = true
state.depthTest = true

export class Mesh3D extends Container3D {
  mesh: PIXI.Mesh

  constructor(geometry: PIXI.Geometry, public shader: Shader, public material = new MetallicRoughnessMaterial()) {
    super()
    this.mesh = this.addChild(new PIXI.Mesh(geometry, shader, state))
  }

  render(renderer: any) {
    this.shader.transform = this.transform
    this.shader.material = this.material
    super.render(renderer)
  }
}