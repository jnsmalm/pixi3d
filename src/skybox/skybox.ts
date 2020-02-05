import { Container3D } from "../container"
import { Model3D } from "../model"
import { SkyboxMaterialFactory } from "./skybox-material"
import { glTFResource } from "../gltf/gltf-resource"

export class Skybox extends Container3D {
  model: Model3D

  constructor(public texture: PIXI.CubeTexture) {
    super("skybox")
    let gltf = new glTFResource(
      JSON.parse(require("../mesh/embedded/cube.gltf").default))

    this.model = this.addChild(
      Model3D.from(gltf, new SkyboxMaterialFactory(texture)))
    this.model.scale.set(500)
  }
}