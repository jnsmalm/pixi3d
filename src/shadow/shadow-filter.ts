import { Renderer, Program, RenderTexture } from "@pixi/core"
import { MeshShader } from "../mesh/mesh-shader"
import { Mesh3D } from "../mesh/mesh"
import { ShadowCastingLight } from "./shadow-casting-light"
import { Shader as Vertex } from "./shader/gaussian-blur.vert"
import { Shader as Fragment } from "./shader/gaussian-blur.frag"
import { StandardShaderSource } from "../material/standard/standard-shader-source"

export class ShadowFilter {
  private _gaussianBlurShader: MeshShader
  private _mesh: Mesh3D

  constructor(public renderer: Renderer) {
    this._mesh = Mesh3D.createQuad()
    this._gaussianBlurShader = new MeshShader(Program.from(
      StandardShaderSource.build(Vertex.source, [], renderer),
      StandardShaderSource.build(Fragment.source, [], renderer)
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