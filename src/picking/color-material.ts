import { Camera3D } from "../camera"
import { Material, MaterialShaderAttribute } from "../material"
import { Mesh3D } from "../mesh/mesh"

const vert = require("./shader/color-picking.vert").default
const frag = require("./shader/color-picking.frag").default

const shader = new PIXI.Shader(PIXI.Program.from(vert, frag))

export class ColorMaterial extends Material {
  private color = new Float32Array(3)

  constructor(color: Uint8Array) {
    super([MaterialShaderAttribute.position])
    for (let i = 0; i < 3; i++) {
      this.color[i] = color[i] / 255
    }
  }

  createShader() {
    return shader
  }

  updateUniforms(mesh: Mesh3D, shader: PIXI.Shader) {
    shader.uniforms.u_Color = this.color
    shader.uniforms.u_World = mesh.transform.worldTransform.array
    shader.uniforms.u_View = Camera3D.main.view
    shader.uniforms.u_Projection = Camera3D.main.projection
  }
}