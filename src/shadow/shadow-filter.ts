import { Renderer, Program, RenderTexture } from "pixi.js"
import { MeshShader } from "../mesh/mesh-shader"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"

export class ShadowFilter {
  private _gaussianBlurShader: MeshShader
  private _mesh: Mesh3D

  constructor(public renderer: Renderer) {
    this._mesh = Mesh3D.createQuad()
    this._gaussianBlurShader = new MeshShader(Program.from(
      require("./shader/gaussian-blur.vert"),
      require("./shader/gaussian-blur.frag")
    ))
  }

  applyGaussianBlur(light: ShadowCastingLight) {
    this.applyBlurScale(light.shadowTexture, light.filterTexture,
      new Float32Array([0, light.softness / light.shadowTexture.height]))
    this.applyBlurScale(light.filterTexture, light.shadowTexture,
      new Float32Array([light.softness / light.shadowTexture.width, 0]))
  }

  applyBlurScale(input: RenderTexture, output: RenderTexture, scale: Float32Array) {
    this.renderer.renderTexture.bind(output)
    this.renderer.renderTexture.clear()

    this._gaussianBlurShader.uniforms.u_FilterSampler = input
    this._gaussianBlurShader.uniforms.u_BlurScale = scale
    this._gaussianBlurShader.render(this._mesh, this.renderer)

    this.renderer.renderTexture.bind(undefined)
  }
}