import { ArrayResource } from "../compatibility/array-resource"
import { FORMATS, TYPES, ALPHA_MODES } from "@pixi/constants"
import { Texture, BaseTexture, Renderer } from "@pixi/core"
import { BaseImageResource } from "../compatibility/base-image-resource"
import { BufferResource } from "../compatibility/buffer-resource"

export class MipmapResource extends ArrayResource {
  constructor(source: (string | Texture)[], public target: number) {
    super(source)
  }

  upload(renderer: Renderer, baseTexture: BaseTexture) {
    renderer.gl.pixelStorei(renderer.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      baseTexture.alphaMode === ALPHA_MODES.UNPACK)

    for (let i = 0; i < this.items.length; i++) {
      const resource = this.items[i].resource
      if (resource instanceof BufferResource) {
        renderer.gl.texImage2D(this.target, i, <FORMATS>baseTexture.format,
          resource.width, resource.height, 0, <FORMATS>baseTexture.format, <TYPES>baseTexture.type, resource.data)
      }
      if (resource instanceof BaseImageResource) {
        renderer.gl.texImage2D(this.target, i, <FORMATS>baseTexture.format,
          <FORMATS>baseTexture.format, <TYPES>baseTexture.type, resource.source)
      }
    }
    return true
  }
}