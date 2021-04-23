import * as PIXI from "pixi.js"

import { ArrayResource } from "../pixi/array-resource"
import { BaseImageResource } from "../pixi/base-image-resource"
import { BufferResource } from "../pixi/buffer-resource"

export class MipmapResource extends ArrayResource {
  constructor(source: (string | PIXI.Texture)[], public target: number) {
    super(source)
  }

  upload(renderer: PIXI.Renderer, baseTexture: PIXI.BaseTexture) {
    for (let i = 0; i < this.items.length; i++) {
      const resource = this.items[i].resource
      if (resource instanceof BufferResource) {
        renderer.gl.texImage2D(this.target, i, <PIXI.FORMATS>baseTexture.format,
          resource.width, resource.height, 0, <PIXI.FORMATS>baseTexture.format, <PIXI.TYPES>baseTexture.type, resource.data)
      }
      if (resource instanceof BaseImageResource) {
        renderer.gl.texImage2D(this.target, i, <PIXI.FORMATS>baseTexture.format,
          <PIXI.FORMATS>baseTexture.format, <PIXI.TYPES>baseTexture.type, resource.source)
      }
    }
    return true
  }
}