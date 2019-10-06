import { Container3D } from "./container"

export interface MeshData {
  indices: ArrayBuffer,
  positions: ArrayBuffer,
  normals: ArrayBuffer
}

export class Mesh3D extends Container3D {
  mesh: PIXI.Mesh

  constructor(geometry: PIXI.Geometry, shader: PIXI.Shader) {
    super()
    this.mesh = this.addChild(new PIXI.Mesh(geometry, shader))
  }

  render(renderer: any) {
    this.mesh.shader.uniforms.model = this.worldTransform
    super.render(renderer)
  }
}