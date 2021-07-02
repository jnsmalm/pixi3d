import * as PIXI from "pixi.js"

import { Cubemap } from "../cubemap/cubemap"
import { MeshShader } from "../mesh/mesh-shader"
import { Camera } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { Material } from "../material/material"

export class SkyboxMaterial extends Material {
  private _cubemap: Cubemap

  get cubemap() {
    return this._cubemap
  }

  set cubemap(value: Cubemap) {
    if (value !== this._cubemap) {
      if (!this._cubemap.valid) {
        // Remove the shader so it can be rebuilt with the current features. 
        // It may happen that we set a texture which is not yet valid, in that 
        // case we don't want to render the skybox until it has become valid.
        this._shader = undefined
      }
      this._cubemap = value
    }
  }

  camera?: Camera

  constructor(cubemap: Cubemap) {
    super()
    this._cubemap = cubemap
    this.state = Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: true, depthTest: true
    })
  }

  updateUniforms(mesh: Mesh3D, shader: MeshShader) {
    let camera = this.camera || Camera.main

    shader.uniforms.u_ModelMatrix = mesh.worldTransform.toArray()
    shader.uniforms.u_View = camera.view
    shader.uniforms.u_Projection = camera.projection
    shader.uniforms.u_EnvironmentSampler = this.cubemap
  }

  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    // Disable writing to the depth buffer. This is because we want all other 
    // objects to be in-front of the skybox.
    renderer.gl.depthMask(false)
    super.render(mesh, renderer)
    renderer.gl.depthMask(true)
  }

  createShader() {
    let vert = require("./shader/skybox.vert")
    let frag = require("./shader/skybox.frag")

    if (this.cubemap.valid) {
      return new MeshShader(PIXI.Program.from(vert, frag))
    }
  }
}