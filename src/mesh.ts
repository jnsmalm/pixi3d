import { Shader } from "./shader"
import { MetallicRoughnessMaterial, MaterialAlphaMode, Material } from "./material"
import { Container3D } from "./container"

const state = new PIXI.State()
state.culling = true
state.depthTest = true

export class Mesh3D extends Container3D {
  mesh: PIXI.Mesh

  constructor(geometry: PIXI.Geometry, public shader: Shader, public material: Material = new MetallicRoughnessMaterial()) {
    super()
    this.mesh = this.addChild(new PIXI.Mesh(geometry, shader, state))
  }

  render(renderer: any) {
    renderer.batch.setObjectRenderer(renderer.plugins["standard"])
    renderer.plugins["standard"].render(this);
  }
}