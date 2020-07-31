import * as PIXI from "pixi.js"

import { CubeGeometry } from "./geometry/cube-geometry"
import { PlaneGeometry } from "./geometry/plane-geometry"
import { MeshGeometry } from "./mesh-geometry"
import { Material } from "../material"
import { PhysicallyBasedMaterial } from "../pbr/pbr-material"
import { Container3D } from "../container"

export class Mesh3D extends Container3D {
  pluginName = "mesh3d"

  /** Names of the passes used for rendering the mesh. */
  renderPasses = ["standard"]

  morphWeights?: number[]

  constructor(public geometry: MeshGeometry, public material?: Material) {
    super()
    if (!geometry) {
      throw new Error("PIXI3D: Geometry is required when creating a mesh.")
    }
  }

  _render(renderer: PIXI.Renderer) {
    renderer.batch.setObjectRenderer(
      <PIXI.ObjectRenderer>(<any>renderer.plugins)[this.pluginName]
    );
    <PIXI.ObjectRenderer>(<any>renderer.plugins)[this.pluginName].render(this)
  }

  static createPlane(material: Material = new PhysicallyBasedMaterial()) {
    return new Mesh3D(PlaneGeometry.create(), material)
  }

  static createCube(material: Material = new PhysicallyBasedMaterial()) {
    return new Mesh3D(CubeGeometry.create(), material)
  }
}