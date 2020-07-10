import * as PIXI from "pixi.js"

import { Camera3D } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { Material, MaterialFactory } from "../material"
import { CubeMipMapTexture } from "../cubemap/cube-mipmap"
import { MeshShader } from "../mesh/mesh-shader"

const vert: string = require("./shader/skybox.vert").default
const frag: string = require("./shader/skybox.frag").default

export class SkyboxMaterialFactory implements MaterialFactory {
  constructor(public texture: CubeMipMapTexture) { }

  create(): Material {
    return new SkyboxMaterial(this.texture)
  }
}

export class SkyboxMaterial extends Material {
  private _texture: CubeMipMapTexture
  private _state = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: true, depthTest: true
  })

  constructor(texture: CubeMipMapTexture) {
    super()
    this._texture = texture
  }

  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    // Disable writing to the depth buffer. This is because we want all other 
    // objects to be in-front of the skybox.
    renderer.gl.depthMask(false)
    super.render(mesh, renderer, this._state)
    renderer.gl.depthMask(true)
  }

  updateUniforms(mesh: Mesh3D, shader: MeshShader) {
    shader.uniforms.u_World = mesh.transform.worldTransform.toArray()
    shader.uniforms.u_View = Camera3D.main.view
    shader.uniforms.u_Projection = Camera3D.main.projection
    shader.uniforms.u_Texture = this._texture
  }

  createShader() {
    if (this._texture.valid) {
      return new MeshShader(PIXI.Program.from(vert, frag))
    }
  }
}