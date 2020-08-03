import * as PIXI from "pixi.js"

import { Camera3D } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { Material } from "../material/material"
import { CubeMipmapTexture } from "../cubemap/cube-mipmap-texture"
import { MeshShader } from "../mesh/mesh-shader"

export class SkyboxMaterial extends Material {
  private _state = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: true, depthTest: true
  })

  get texture() {
    return this._texture
  }

  set texture(value: CubeMipmapTexture) {
    if (value !== this._texture) {
      if (!this._texture.valid) {
        // Remove the shader so it can be rebuilt with the current features. 
        // It may happen that we set a texture which is not yet valid, in that 
        // case we don't want to render the skybox until it has become valid.
        this._shader = undefined
      }
      this._texture = value
    }
  }

  camera?: Camera3D

  constructor(private _texture: CubeMipmapTexture) {
    super()
  }

  updateUniforms(mesh: Mesh3D, shader: MeshShader) {
    let camera = this.camera || Camera3D.main

    shader.uniforms.u_ModelMatrix = mesh.worldTransform.toArray()
    shader.uniforms.u_View = camera.view
    shader.uniforms.u_Projection = camera.projection
    shader.uniforms.u_EnvironmentSampler = this.texture
  }

  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    // Disable writing to the depth buffer. This is because we want all other 
    // objects to be in-front of the skybox.
    renderer.gl.depthMask(false)
    super.render(mesh, renderer, this._state)
    renderer.gl.depthMask(true)
  }

  createShader() {
    const vert: string = require("./shader/skybox.vert").default
    const frag: string = require("./shader/skybox.frag").default
    
    if (this.texture.valid) {
      return new MeshShader(PIXI.Program.from(vert, frag))
    }
  }
}