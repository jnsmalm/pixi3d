import { PickingHitArea } from "./picking-hitarea"
import { Mesh3D } from "../mesh/mesh"
import { Camera } from "../camera/camera"
import { RenderTexture, Renderer, Program } from "@pixi/core"
import { Mat4 } from "../math/mat4"
import { MeshShader } from "../mesh/mesh-shader"
import { Shader as Vertex } from "./shader/picking.vert"
import { Shader as Fragment } from "./shader/picking.frag"
import { settings } from "@pixi/settings"

export class PickingMap {
  private _pixels: Uint8Array
  private _output: RenderTexture
  private _shader: MeshShader
  private _update = 0

  constructor(private _renderer: Renderer, size: number) {
    this._pixels = new Uint8Array(size * size * 4)
    this._output = RenderTexture.create({ width: size, height: size, resolution: 1 })
    this._shader = new MeshShader(Program.from(Vertex.source, Fragment.source))
    this._output.framebuffer.addDepthTexture()
  }

  destroy() {
    this._output.destroy(true)
    this._shader.destroy()
  }

  resizeToAspect() {
    const aspect = this._renderer.width / this._renderer.height
    const aspectWidth = Math.floor(this._output.height * aspect)
    if (this._output.width !== aspectWidth) {
      this._pixels = new Uint8Array(aspectWidth * this._output.height * 4)
      this._output.resize(aspectWidth, this._output.height)
    }
  }

  containsId(x: number, y: number, id: Uint8Array) {
    const { width, height } = this._renderer.screen

    x = Math.floor(x / width * this._output.width)
    y = Math.floor((height - y) / height * this._output.height)
    for (let i = 0; i < 3; i++) {
      if (id[i] !== this._pixels[(y * this._output.width + x) * 4 + i]) {
        return false
      }
    }
    return true
  }

  update(hitAreas: PickingHitArea[]) {
    this._renderer.renderTexture.bind(this._output)
    if (this._update++ % 2 === 0) {
      // For performance reasons, the update method alternates between rendering 
      // the meshes and reading the pixels from the rendered texture.
      this._renderer.renderTexture.clear()
      for (let hitArea of hitAreas) {
        this.renderHitArea(hitArea)
      }
    } else {
      const gl = this._renderer.gl
      gl.readPixels(0, 0, this._output.width, this._output.height, gl.RGBA, gl.UNSIGNED_BYTE, this._pixels)
    }
    this._renderer.renderTexture.bind(undefined)
  }

  private _matrix = new Float32Array(16)

  renderHitArea(hitArea: PickingHitArea) {
    const uniforms = this._shader.uniforms
    const meshes = hitArea.object instanceof Mesh3D ? [hitArea.object] : hitArea.object.meshes
    const camera = hitArea.camera || Camera.main
    for (let mesh of meshes) {
      uniforms.u_Id = hitArea.id
      uniforms.u_ModelViewProjection = Mat4.multiply(
        camera.viewProjection, mesh.transform.worldTransform.array, this._matrix)
      this._shader.render(mesh, this._renderer)
    }
  }
}