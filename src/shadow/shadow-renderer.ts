import { State, Renderer } from "@pixi/core"
import { BLEND_MODES } from "@pixi/constants"
import { ShadowShader } from "./shadow-shader"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { SkinningShader } from "./skinning-shader"
import { TextureShader } from "./texture-shader"
import { Debug } from "../debug"
import { Message } from "../message"

export class ShadowRenderer {
  private _state = Object.assign(new State(), {
    depthTest: true, clockwiseFrontFace: false, culling: true, blendMode: BLEND_MODES.NONE
  })
  private _shadowShader: ShadowShader
  private _instancedShadowShader: ShadowShader
  private _skinningShader?: SkinningShader
  private _textureShader?: TextureShader

  constructor(public renderer: Renderer) {
    this._shadowShader = new ShadowShader(this.renderer)
    this._instancedShadowShader = new ShadowShader(this.renderer, ["USE_INSTANCING 1"])
  }

  getSkinningShader() {
    if (this._textureShader || this._skinningShader) {
      return this._textureShader || this._skinningShader
    }
    if (TextureShader.isSupported(this.renderer)) {
      this._textureShader = new TextureShader(this.renderer)
    } else {
      Debug.warn(Message.meshVertexSkinningFloatingPointTexturesNotSupported)
      this._skinningShader = new SkinningShader(this.renderer)
    }
    return this._textureShader || this._skinningShader
  }

  render(mesh: Mesh3D, shadowCastingLight: ShadowCastingLight) {
    const useInstances = mesh.instances.length > 0;
    let shader: ShadowShader | undefined = useInstances ? this._instancedShadowShader : this._shadowShader;
    if (mesh.skin) {
      let skinningShader = this.getSkinningShader()
      if (skinningShader && mesh.skin.joints.length > skinningShader.maxSupportedJoints) {
        Debug.error(Message.meshVertexSkinningNumberOfJointsNotSupported, {
          joints: mesh.skin.joints.length,
          maxJoints: skinningShader.maxSupportedJoints
        })
      } else {
        shader = skinningShader
      }
    }
    if (shader) {
      shader.updateUniforms(mesh, shadowCastingLight)
      shader.render(mesh, this.renderer, this._state)
    }
  }
}