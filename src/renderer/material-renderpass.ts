import * as PIXI from "pixi.js"

import { Mesh3D } from "../mesh/mesh"
import { MeshRenderPass } from "./mesh-renderpass"

interface RenderToTextureOptions {
  width?: number, height?: number, depth?: boolean
}

/**
 * Render pass used for materials.
 */
export class MaterialRenderPass implements MeshRenderPass {
  private _colorTexture?: PIXI.RenderTexture
  private _colorTextureAutoResize = true

  private _state = {
    back: Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: true, depthTest: true
    }),
    fore: Object.assign(new PIXI.State(), {
      culling: true, clockwiseFrontFace: false, depthTest: true
    }),
  }

  get colorTexture() {
    return this._colorTexture
  }

  get depthTexture() {
    if (this._colorTexture) {
      // @ts-ignore
      return this._colorTexture.baseTexture.framebuffer.depthTexture
    }
  }

  /**
   * Creates a new material rendering pass.
   * @param renderer Renderer to use.
   * @param name Name for the render pass.
   */
  constructor(public renderer: PIXI.Renderer, public name: string) {
    renderer.on("prerender", () => {
      if (this._colorTexture && this._colorTextureAutoResize) {
        this._colorTexture.resize(renderer.width, renderer.height)
      }
    })
  }

  enableRenderToTexture(options: RenderToTextureOptions = {}) {
    let { width = 512, height = 512 } = options
    if (options && options.width && options.height) {
      this._colorTextureAutoResize = false
    }
    this._colorTexture = PIXI.RenderTexture.create({ width, height })
    if (options && options.depth) {
      // @ts-ignore
      this._colorTexture.baseTexture.framebuffer.addDepthTexture()
    }
  }

  /**
   * Renders all specified meshes.
   */
  render(meshes: Mesh3D[]) {
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(this._colorTexture)
    }
    for (let mesh of meshes) {
      if (mesh.material) {
        if (mesh.material.doubleSided) {
          mesh.material.render(mesh, this.renderer, this._state.back)
          mesh.material.render(mesh, this.renderer, this._state.fore)
        } else {
          mesh.material.render(mesh, this.renderer, this._state.fore)
        }
      }
    }
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(undefined)
    }
  }

  clear() {
    if (this._colorTexture) {
      this.renderer.renderTexture.bind(this._colorTexture)
      this.renderer.renderTexture.clear()
      this.renderer.renderTexture.bind(undefined)
    }
  }
}