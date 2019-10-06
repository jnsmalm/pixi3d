import { Container3D } from "./container"

export interface BaseMesh {
  shader: PIXI.Shader
  geometry: PIXI.Geometry
}

export interface MeshData {
  indices: ArrayBuffer,
  positions: ArrayBuffer,
  normals: ArrayBuffer
}

export class Mesh3D extends Container3D {
  mesh: PIXI.Mesh

  constructor(private _baseMesh: BaseMesh) {
    super()
    this.mesh = this.addChild(new PIXI.Mesh(_baseMesh.geometry, _baseMesh.shader))
  }

  get baseMesh() {
    return this._baseMesh
  }

  set baseMesh(value: BaseMesh) {
    if (this._baseMesh === value) {
      return
    }
    this._baseMesh = value
    this.mesh.geometry = value.geometry
    this.mesh.shader = value.shader
  }

  render(renderer: any) {
    this.mesh.shader.uniforms.model = this.worldTransform
    super.render(renderer)
  }
}