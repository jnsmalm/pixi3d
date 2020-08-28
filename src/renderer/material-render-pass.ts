import * as PIXI from "pixi.js"

import { RenderPass } from "./render-pass"
import { Mesh3D } from "../mesh/mesh"

/**
 * Pass used for rendering materials.
 */
export class MaterialRenderPass implements RenderPass {
  private _colorTexture?: PIXI.RenderTexture
  private _colorTextureAutoResize = true

  private _transparent = [
    Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: true, depthTest: true
    }),
    Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: false, depthTest: true
    })
  ]

  private _default = Object.assign(new PIXI.State(), {
    culling: true, clockwiseFrontFace: false, depthTest: true
  })

  private _doubleSided = Object.assign(new PIXI.State(), {
    culling: false, clockwiseFrontFace: true, depthTest: true
  })

  /** Returns the color texture used when rendering to a texture.*/
  get colorTexture() {
    return this._colorTexture
  }

  /** Returns the depth texture used when rendering to a texture.*/
  get depthTexture() {
    if (this._colorTexture) {
      // @ts-ignore
      return <PIXI.BaseTexture>this._colorTexture.baseTexture.framebuffer.depthTexture
    }
  }

  /**
   * Creates a new material render pass.
   * @param renderer The renderer to use.
   * @param name The name of the render pass.
   */
  constructor(public renderer: PIXI.Renderer, public name: string) {
    renderer.on("prerender", () => {
      if (this._colorTexture && this._colorTextureAutoResize) {
        this._colorTexture.resize(renderer.width, renderer.height)
      }
    })
  }

  /**
   * Enables rendering to a texture using the specified width/height. If the 
   * width or height is empty, the texture will have the same size as the renderer.
   * @param width The width of the texture.
   * @param height The height of the texture.
   */
  enableRenderToTexture(width?: number, height?: number) {
    this._colorTexture = PIXI.RenderTexture.create({ width, height })
    if (width && height) {
      this._colorTextureAutoResize = false
    }
    // @ts-ignore
    this._colorTexture.baseTexture.framebuffer.addDepthTexture()
  }

  clear() {
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(this._colorTexture)
      this.renderer.renderTexture.clear()
      this.renderer.renderTexture.bind(undefined)
    }
  }

  render(meshes: Mesh3D[]) {
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(this._colorTexture)
    }
    for (let mesh of meshes) {
      if (!mesh.material) { return }
      if (mesh.material.doubleSided && !mesh.material.transparent) {
        mesh.material.render(mesh, this.renderer, this._doubleSided)
      } else if (mesh.material.doubleSided) {
        mesh.material.render(mesh, this.renderer, this._transparent[0])
        mesh.material.render(mesh, this.renderer, this._transparent[1])
      } else {
        mesh.material.render(mesh, this.renderer, this._default)
      }
    }
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(undefined)
    }
  }
}