import * as PIXI from "pixi.js"

import { MeshPickerHitArea } from "./picker-hitarea"
import { Mesh3D } from "../mesh/mesh"

const SIZE = 128

export class MeshPicker {
  private pixels = new Uint8Array(SIZE * SIZE * 4)
  private texture = PIXI.RenderTexture.create({ width: SIZE, height: SIZE })
  private frame = 0
  private meshes: Mesh3D[] = []

  constructor(public renderer: PIXI.Renderer) {
    renderer.on("postrender", () => { this.update() })
  }

  add(mesh: Mesh3D) {
    this.meshes.push(mesh)
  }

  containsColor(x: number, y: number, color: Uint8Array) {
    if (!this.pixels || !this.texture) {
      return false
    }
    x = Math.floor(x / this.renderer.width * SIZE)
    y = this.renderer.height - y
    y = Math.floor(y / this.renderer.height * SIZE)
    let index = (y * SIZE + x) * 4
    for (let i = 0; i < 3; i++) {
      if (this.pixels[index + i] !== color[i]) {
        return false
      }
    }
    return true
  }

  update() {
    const gl = this.renderer.gl
    if (this.meshes.length === 0) {
      return
    }
    this.renderer.renderTexture.bind(this.texture)
    if (this.frame++ % 2 === 0) {
      this.renderer.renderTexture.clear()
      for (let mesh of this.meshes) {
        if (mesh.hitArea instanceof MeshPickerHitArea) {
          mesh.hitArea.render(this.renderer)
        }
      }
      this.meshes = []
    } else {
      gl.readPixels(0, 0, SIZE * this.renderer.resolution, SIZE * this.renderer.resolution, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels)
    }
    this.renderer.renderTexture.bind(undefined)
  }
}

PIXI.Renderer.registerPlugin("picker", <any>MeshPicker)