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
  private _valid = false

  constructor(public texture: CubeMipMapTexture) {
    super()
    this.doubleSided = true
  }

  get valid() {
    if (this._valid) {
      return true
    }
    return this._valid = this.texture && this.texture.valid
  }

  updateUniforms(mesh: Mesh3D, shader: MeshShader) {
    shader.uniforms.u_World = mesh.transform.worldTransform.toArray()
    shader.uniforms.u_View = Camera3D.main.view
    shader.uniforms.u_Projection = Camera3D.main.projection
    shader.uniforms.u_Texture = this.texture
  }

  createShader() {
    return new MeshShader(PIXI.Program.from(vert, frag))
  }
}