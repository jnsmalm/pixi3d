import { Material, MaterialFactory } from "../material"
import { Container3D } from "../container"
import { MeshPickerHitArea } from "../picking/picker-hitarea"
import { glTFResource } from "../gltf/gltf-resource"
import { glTFParser } from "../gltf/parser"
import { MeshGeometryData } from "./mesh-geometry"

export class Mesh3D extends Container3D {
  pluginName = "sortable"

  constructor(name: string | undefined, public geometry: MeshGeometryData, public material: Material, public weights?: number[]) {
    super(name)
  }

  render(renderer: any) {
    super.render(renderer)
    let meshRenderer = renderer.plugins[this.pluginName]
    if (!meshRenderer) {
      throw new Error(`PIXI3D: Renderer with name "${this.pluginName}" does not exist.`)
    }
    renderer.batch.setObjectRenderer(meshRenderer)
    meshRenderer.render(this)

    let picker = renderer.plugins.picker
    if (picker && this.isInteractive()) {
      if (!this.hitArea) {
        this.hitArea = new MeshPickerHitArea(picker, this)
      }
      picker.add(this)
    }
  }

  isInteractive(object?: any): boolean {
    object = object || this
    if (object.interactive) {
      return true
    }
    if (object.parent) {
      return this.isInteractive(object.parent)
    }
    return false
  }

  static createTorus(material?: MaterialFactory) {
    let options = { materialFactory: material }
    return new glTFParser(
      new glTFResource(
        JSON.parse(require("./embedded/torus.gltf").default)),
      options).createMesh()
  }

  static createCube(material: MaterialFactory) {
    let options = { materialFactory: material }
    return new glTFParser(
      new glTFResource(
        JSON.parse(require("./embedded/cube.gltf").default)),
      options).createMesh()
  }

  static createSphere(material: MaterialFactory) {
    let options = { materialFactory: material }
    return new glTFParser(
      new glTFResource(
        JSON.parse(require("./embedded/sphere.gltf").default)),
      options).createMesh()
  }
}