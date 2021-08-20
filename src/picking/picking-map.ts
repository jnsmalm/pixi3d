import * as PIXI from "pixi.js"

import { PickingHitArea } from "./picking-hitarea"
import { Camera } from "../camera/camera"
import { Mesh3D } from "../mesh/mesh"
import { MeshShader } from "../mesh/mesh-shader"

export class PickingMap {
  private _pixels: Uint8Array
  private _output: PIXI.RenderTexture
  private _shader: MeshShader
  private _update = 0

  constructor(private _renderer: PIXI.Renderer, width: number, height: number) {
    this._pixels = new Uint8Array(width * height * 4)
    this._output = PIXI.RenderTexture.create({ width, height })
    this._shader = new MeshShader(
      PIXI.Program.from(require("./shader/picking.vert"), require("./shader/picking.frag")))
    this._output.framebuffer.addDepthTexture()
  }

  destroy() {
    this._output.destroy(true)
    this._shader.destroy()
  }

  resize(width: number, height: number) {
    this._pixels = new Uint8Array(width * height * 4)
    this._output.resize(width, height)
  }

  containsId(x: number, y: number, id: Uint8Array) {
    x = Math.floor(x / this._renderer.width * this._output.width)
    y = Math.floor((this._renderer.height - y) / this._renderer.height * this._output.height)
    for (let i = 0; i < 3; i++) {
      if (id[i] !== this._pixels[(y * this._output.width + x) * 4 + i]) {
        return false
      }
    }
    return true
  }

  get width() { return this._output.width }

  get height() { return this._output.height }

  update(hitAreas: PickingHitArea[]) {
    this._renderer.renderTexture.bind(this._output)
    if (this._update++ % 2 === 0) {
      // For performance reasons, the update method alternates between rendering 
      // the meshes and reading the pixels from the rendered texture.
      this._renderer.renderTexture.clear()
      for (let hitArea of hitAreas) {
        let meshes = hitArea.object instanceof Mesh3D ? [hitArea.object] : hitArea.object.meshes
        let camera = hitArea.camera || Camera.main
        for (let mesh of meshes) {
          this._shader.uniforms.u_World = mesh.transform.worldTransform.array
          this._shader.uniforms.u_Id = hitArea.id
          this._shader.uniforms.u_ViewProjection = camera.viewProjection
          this._shader.render(mesh, this._renderer)
        }
      }
    } else {
      const gl = this._renderer.gl
      gl.readPixels(0, 0, this._output.width * this._renderer.resolution, this._output.height * this._renderer.resolution, gl.RGBA, gl.UNSIGNED_BYTE, this._pixels)
    }
    this._renderer.renderTexture.bind(undefined)
  }
}