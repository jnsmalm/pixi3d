import * as PIXI from "pixi.js"

import { Material, MaterialFactory } from "../material"
import { Container3D } from "../container"
import { MeshPickerHitArea } from "../picking/picker-hitarea"
import { glTFResource } from "../gltf/gltf-resource"
import { glTFParser } from "../gltf/parser"
import { MeshGeometry } from "./mesh-geometry"
import { MeshPicker } from "../picking/mesh-picker"

export class Mesh3D extends Container3D {
  pluginName = "mesh3d"

  constructor(public geometry: MeshGeometry, public material: Material) {
    super()
  }

  _render(renderer: PIXI.Renderer) {
    if (!this.geometry.hasMaterialAttributes(this.material)) {
      this.geometry.addMaterialAttributes(this.material)
    }
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

  static createCube(materialFactory?: MaterialFactory) {
    return new glTFParser(
      new glTFResource(
        JSON.parse(require("./embedded/cube.gltf").default)),
      materialFactory).createMesh()
  }

  static createSphere(materialFactory?: MaterialFactory) {
    return new glTFParser(
      new glTFResource(
        JSON.parse(require("./embedded/sphere.gltf").default)),
      materialFactory).createMesh()
  }
}