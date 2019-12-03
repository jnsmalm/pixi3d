import { Container3D } from "../container"
import { Model3D } from "../model"
import { glTFResource } from "../gltf/gltf-resource"
import { SkyboxShader } from "./skybox-shader"

export class Skybox extends Container3D {
  model: Model3D

  constructor(public texture: PIXI.CubeTexture) {
    super("skybox")

    let gltf = new glTFResource(
      JSON.parse(require("../resources/cube.gltf").default))
      
    this.model = this.addChild(Model3D.from(gltf, {
      shader: new SkyboxShader(this.texture)
    }))
    this.model.scale.set(500)
  }
}