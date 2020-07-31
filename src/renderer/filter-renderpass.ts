import * as PIXI from "pixi.js"

import { Mesh3D } from "../mesh/mesh"
import { MeshRenderPass } from "./mesh-renderpass"
import { MeshShader } from "../mesh/mesh-shader"
import { MeshGeometry } from "../mesh/geometry/mesh-geometry"

/**
 * Render pass used for post processing filters.
 */
export class FilterRenderPass implements MeshRenderPass {
  private _mesh: Mesh3D
  private _outputTexture?: PIXI.RenderTexture
  private _outputTextureAutoResize = true

  /** Gets the output render texture. */
  get outputTexture() {
    return this._outputTexture
  }

  /**
   * Creates a new filter rendering pass.
   * @param renderer Renderer to use.
   * @param name Name for this render pass.
   * @param shader Shader to use for filter.
   * @param input Input texture to use for filter.
   */
  constructor(public renderer: PIXI.Renderer, public name: string, public shader: MeshShader, public input?: PIXI.Texture) {
    this._mesh = new Mesh3D(Object.assign(new MeshGeometry(), {
      indices: {
        buffer: new Uint8Array([0, 1, 2, 0, 3, 1]),
        stride: 0
      },
      positions: {
        buffer: new Float32Array([-1, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0,]),
        stride: 0
      }
    }))
    renderer.on("prerender", () => {
      if (this._outputTexture && this._outputTextureAutoResize) {
        this._outputTexture.resize(renderer.width, renderer.height)
      }
    })
  }

  enableRenderToTexture(options: { width?: number, height?: number, format?: PIXI.FORMATS, type?: PIXI.TYPES } = {}) {
    let { width = 512, height = 512, format, type } = options
    if (options && options.width && options.height) {
      this._outputTextureAutoResize = false
    }
    // @ts-ignore format does exist in options
    this._outputTexture = PIXI.RenderTexture.create({ width, height, format, type })
  }

  /**
   * Renders this post processing filter pass.
   */
  render() {
    if (this._outputTexture) {
      this.renderer.renderTexture.bind(this._outputTexture)
    }
    this.updateUniforms()
    this.shader.render(this._mesh, this.renderer)
    if (this._outputTexture) {
      this.renderer.renderTexture.bind(undefined)
    }
  }

  /**
   * Updates the shader uniforms before rendering.
   */
  updateUniforms() {
    // @ts-ignore uniformData does exist on program
    let uniformData = this.shader.program.uniformData

    if (uniformData.u_ViewSize) {
      if (this._outputTexture) {
        this.shader.uniforms.u_ViewSize = [
          this._outputTexture.width,
          this._outputTexture.height
        ]
      } else {
        this.shader.uniforms.u_ViewSize = [
          this.renderer.width,
          this.renderer.height
        ]
      }
    }
    if (uniformData.u_Input) {
      this.shader.uniforms.u_Input = this.input
    }
  }

  /**
   * Clears the filter pass before rendering.
   */
  clear() {
    this.renderer.renderTexture.bind(this._outputTexture)
    this.renderer.renderTexture.clear()
    this.renderer.renderTexture.bind(undefined)
  }

  /**
   * Creates a new filter rendering pass from the specified shader source.
   * @param renderer Renderer to use.
   * @param vertexSource Vertex shader source.
   * @param fragmentSource Fragment shader source.
   * @param input Input texture to use for filter.
   */
  static from(renderer: PIXI.Renderer, name: string, vertexSource: string, fragmentSource: string, input?: PIXI.Texture) {
    return new FilterRenderPass(renderer, name,
      new MeshShader(PIXI.Program.from(vertexSource, fragmentSource)), input)
  }
}