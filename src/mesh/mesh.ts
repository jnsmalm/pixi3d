import * as PIXI from "pixi.js"

import { Material, MaterialFactory } from "../material"
import { Container3D } from "../container"
import { MeshPickerHitArea } from "../picking/picker-hitarea"
import { glTFAsset } from "../gltf/gltf-asset"
import { glTFParser } from "../gltf/gltf-parser"
import { MeshGeometry } from "./mesh-geometry"
import { MeshPicker } from "../picking/mesh-picker"

export class Mesh3D extends Container3D {
  pluginName = "mesh3d"

  /** Names of the passes used for rendering the mesh. */
  renderPasses = ["standard"]

  constructor(public geometry: MeshGeometry, public material?: Material) {
    super()
    if (!geometry) {
      throw new Error("PIXI3D: Geometry is required when creating a mesh.")
    }
  }

  _render(renderer: PIXI.Renderer) {
    let meshRenderer = <PIXI.ObjectRenderer>(<any>renderer.plugins)[this.pluginName]
    if (!meshRenderer) {
      throw new Error(`PIXI3D: Renderer with name "${this.pluginName}" does not exist.`)
    }
    renderer.batch.setObjectRenderer(meshRenderer)
    meshRenderer.render(this)

    let picker = <MeshPicker>(<any>renderer.plugins).picker
    if (picker && this.isInteractive()) {
      if (!this.hitArea) {
        this.hitArea = new MeshPickerHitArea(picker, this)
      }
      picker.add(this)
    }
  }

  isInteractive(object?: PIXI.DisplayObject): boolean {
    object = object || this
    if (object.interactive) {
      return true
    }
    if (object.parent) {
      return this.isInteractive(object.parent)
    }
    return false
  }

  static createPlane(materialFactory?: MaterialFactory) {
    return new glTFParser(
      glTFAsset.load(
        JSON.parse(require("./assets/plane.gltf").default)),
      materialFactory).createMesh()[0]
  }

  static createCube(materialFactory?: MaterialFactory) {
    return new glTFParser(
      glTFAsset.load(
        JSON.parse(require("./assets/cube.gltf").default)),
      materialFactory).createMesh()[0]
  }
}