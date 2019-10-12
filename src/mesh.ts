import { Shader } from "./shader"
import { Container3D } from "./container"
import { Transform3D } from "./transform"

export interface MeshData {
  transform: Transform3D,
  indices: ArrayBuffer,
  positions: ArrayBuffer,
  normals: ArrayBuffer,
  texCoords: ArrayBuffer
}

const state = new PIXI.State()
state.culling = true
state.depthTest = true

export class Mesh3D extends Container3D {
  mesh: PIXI.Mesh

  constructor(geometry: PIXI.Geometry, public shader: Shader, transform?: Transform3D) {
    super()
    this.mesh = this.addChild(new PIXI.Mesh(geometry, shader, state))
    if (transform) {
      this.transform.position = transform.position
      this.transform.scale = transform.scale
      this.transform.rotation = transform.rotation
    }
  }

  render(renderer: any) {
    this.shader.transform = this.transform
    super.render(renderer)
  }
}