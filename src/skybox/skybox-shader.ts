import { MeshShader, MeshShaderAttribute } from "../shader"
import { Mesh3D } from "../mesh"
import { Camera3D } from "../camera"

const vert: string = require("./glsl/skybox.vert").default
const frag: string = require("./glsl/skybox.frag").default

export class SkyboxShader extends MeshShader {
  constructor(public cubeTexture: PIXI.CubeTexture) {
    super(PIXI.Program.from(vert, frag), [MeshShaderAttribute.position])
  }

  updateUniforms(mesh: Mesh3D) {
    this.uniforms.world = mesh.transform.worldTransform.array
    this.uniforms.view = Camera3D.main.view
    this.uniforms.projection = Camera3D.main.projection
    this.uniforms.cubemap = this.cubeTexture
  }
}