import * as PIXI from "pixi.js"

import { ShadowShader } from "./shadow-shader"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { SkinningShader } from "./skinning-shader"
import { TextureShader } from "./texture-shader"
import { Console } from "../console"

export class ShadowRenderer {
  private _state = Object.assign(new PIXI.State(), {
    depthTest: true, clockwiseFrontFace: false, culling: true, blendMode: PIXI.BLEND_MODES.NONE
  })
  private _shadowShader: ShadowShader
  private _skinningShader?: SkinningShader
  private _textureShader?: TextureShader

  constructor(public renderer: PIXI.Renderer) {
    this._shadowShader = new ShadowShader()
  }

  render(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    let shader: ShadowShader | undefined = this._shadowShader
    if (mesh.skin && mesh.geometry.joints && mesh.geometry.weights) {
      if (!this._skinningShader) {
        this._skinningShader = new SkinningShader(this.renderer)
      }
      shader = this._skinningShader
      if (mesh.skin.joints.length > this._skinningShader.maxSupportedJoints) {
        if (!this._textureShader) {
          if (TextureShader.isSupported(this.renderer)) {
            this._textureShader = new TextureShader()
          }
        }
        shader = this._textureShader
      }
    }
    if (shader) {
      shader.updateUniforms(mesh, shadowCastingLight)
      shader.render(mesh, this.renderer, this._state)
    }
  }
}