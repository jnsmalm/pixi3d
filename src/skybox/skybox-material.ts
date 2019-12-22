import { Camera3D } from "../camera"
import { Material, MaterialShaderAttribute, MaterialFactory } from "../material"

const vert: string = require("./glsl/skybox.vert").default
const frag: string = require("./glsl/skybox.frag").default

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

  createShader() {
    return new PIXI.Shader(PIXI.Program.from(vert, frag))
  }

  updateUniforms(shader: PIXI.Shader) {
    shader.uniforms.world = this.mesh.transform.worldTransform.array
    shader.uniforms.view = Camera3D.main.view
    shader.uniforms.projection = Camera3D.main.projection
    shader.uniforms.cubemap = this.texture
  }
}