import * as PIXI from "pixi.js"

import { Material, MaterialFactory } from "../material"
import { Container3D } from "../container"
import { MeshGeometry } from "./mesh-geometry"
import { glTFAsset } from "../gltf/gltf-asset"
import { glTFParser } from "../gltf/gltf-parser"

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

  static createPlane(materialFactory?: MaterialFactory) {
    return glTFParser.createMesh(
      glTFAsset.load(
        JSON.parse(require("./assets/plane.gltf").default)),
      materialFactory)[0]
  }

  static createCube(materialFactory?: MaterialFactory) {
    return glTFParser.createMesh(
      glTFAsset.load(
        JSON.parse(require("./assets/cube.gltf").default)),
      materialFactory)[0]
  }
}