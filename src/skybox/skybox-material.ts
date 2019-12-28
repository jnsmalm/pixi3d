import { Camera3D } from "../camera"
import { Material, MaterialShaderAttribute, MaterialFactory } from "../material"

const vert: string = require("./shader/skybox.vert").default
const frag: string = require("./shader/skybox.frag").default

export class SkyboxMaterialFactory implements MaterialFactory {
  constructor(public texture: PIXI.CubeTexture) { }

  create(): Material {
    return new SkyboxMaterial(this.texture)
  }
}

export class SkyboxMaterial extends Material {
  constructor(public texture: PIXI.CubeTexture) {
    super([MaterialShaderAttribute.position])
    this.state.clockwiseFrontFace = true
  }

  get renderable() {
    return this.texture && this.texture.valid
  }

  updateUniforms(shader: PIXI.Shader) {
    shader.uniforms.u_World = this.mesh.transform.worldTransform.array
    shader.uniforms.u_View = Camera3D.main.view
    shader.uniforms.u_Projection = Camera3D.main.projection
    shader.uniforms.u_Texture = this.texture
  }

  createShader() {
    return new PIXI.Shader(PIXI.Program.from(vert, frag))
  }
}