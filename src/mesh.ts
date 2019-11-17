import { Shader } from "./shader"
import { MetallicRoughnessMaterial, Material } from "./material"
import { Container3D } from "./container"

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
  geometry: PIXI.Geometry
  weights?: number[]
  pluginName = "mesh3d"

  constructor(name: string | undefined, geometry: PIXI.Geometry | MeshGeometryData, public shader: Shader, public material: Material = new MetallicRoughnessMaterial()) {
    super(name)
    if (geometry instanceof PIXI.Geometry) {
      this.geometry = geometry
    } else {
      this.geometry = shader.createGeometry(geometry)
      this.weights = geometry.weights
    }
  }

  render(renderer: any) {
    let meshRenderer = renderer.plugins[this.pluginName]
    if (!meshRenderer) {
      throw new Error(`PIXI3D: Renderer with name "${this.pluginName}" does not exist.`)
    }
    renderer.batch.setObjectRenderer(meshRenderer)
    meshRenderer.render(this)
  }
}