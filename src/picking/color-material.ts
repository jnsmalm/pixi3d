import * as PIXI from "pixi.js"

import { Material } from "../material"
import { Camera3D } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { MeshShader } from "../mesh/mesh-shader"

const vert = require("./shader/color-picking.vert").default
const frag = require("./shader/color-picking.frag").default

const shader = new MeshShader(PIXI.Program.from(vert, frag))

export class ColorMaterial extends Material {
  private color = new Float32Array(3)

  constructor(color: Uint8Array) {
    super()
    for (let i = 0; i < 3; i++) {
      this.color[i] = color[i] / 255
    }
  }

  createShader() {
    return shader
  }

  updateUniforms(mesh: Mesh3D, shader: PIXI.Shader) {
    shader.uniforms.u_Color = this.color
    shader.uniforms.u_World = mesh.transform.worldTransform.toArray()
    shader.uniforms.u_View = Camera3D.main.view
    shader.uniforms.u_Projection = Camera3D.main.projection
  }
}