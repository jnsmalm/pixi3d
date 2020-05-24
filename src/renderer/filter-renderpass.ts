import * as PIXI from "pixi.js"

import { Mesh3D } from "../mesh/mesh"
import { MeshRenderPass } from "./mesh-renderpass"
import { MeshShader } from "../mesh/mesh-shader"
import { MeshGeometry } from "../mesh/mesh-geometry"

interface FilterRenderPassOptions {
  input?: PIXI.Texture
  width?: number
  height?: number
  format?: PIXI.FORMATS
  type?: PIXI.TYPES
}

/**
 * Render pass used for post processing filters.
 */
export class FilterRenderPass implements MeshRenderPass {
  private _mesh: Mesh3D

  renderToTexture = false

  /** Texture input to this render pass. */
  input?: PIXI.Texture

  /** Texture output from this render pass. */
  output: PIXI.RenderTexture

  /**
   * Creates a new filter rendering pass.
   * @param renderer Renderer to use.
   * @param shader Shader to use for filter.
   * @param input Input texture to use for filter.
   */
  constructor(public renderer: PIXI.Renderer, public name: string, public shader: MeshShader, options: FilterRenderPassOptions = {}) {
    let { input, width = 256, height = 256, format = PIXI.FORMATS.RGBA, type = PIXI.TYPES.UNSIGNED_BYTE } = options

    this.input = input

    // @ts-ignore Format does exist in the options
    this.output = PIXI.RenderTexture.create({ width, height, format, type })

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
  }

  /**
   * Renders this post processing filter pass.
   */
  render() {
    if (this.renderToTexture) {
      this.renderer.renderTexture.bind(this.output)
    }
    this.updateUniforms()
    this.shader.render(this._mesh, this.renderer)
    if (this.renderToTexture) {
      this.renderer.renderTexture.bind(undefined)
    }
  }

  /**
   * Updates the shader uniforms before rendering.
   */
  updateUniforms() {
    // @ts-ignore uniformData does exist on program
    let uniformData = this.shader.program.uniformData

    if (uniformData.u_OutputSize) {
      if (this.renderToTexture) {
        this.shader.uniforms.u_OutputSize = [
          this.output.width,
          this.output.height
        ]
      } else {
        this.shader.uniforms.u_OutputSize = [
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
    this.renderer.renderTexture.bind(this.output)
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
  static from(renderer: PIXI.Renderer, name: string, vertexSource: string, fragmentSource: string, options: FilterRenderPassOptions = {}) {
    return new FilterRenderPass(
      renderer, name, new MeshShader(PIXI.Program.from(vertexSource, fragmentSource)), options)
  }
}