import * as PIXI from "pixi.js"

// @ts-ignore PIXI.resources.ArrayResource was moved after PixiJS 6.0+
const ArrayResource: typeof PIXI.resources.ArrayResource = PIXI.ArrayResource || PIXI.resources.ArrayResource

export class MipmapResource extends ArrayResource {
  constructor(source: string[] | PIXI.Texture[], public target: number) {
    super(source)
  }

  upload(renderer: PIXI.Renderer, baseTexture: PIXI.BaseTexture) {
    for (let i = 0; i < this.items.length; i++) {
      let source = (this.items[i].resource as PIXI.resources.BaseImageResource).source
      renderer.gl.texImage2D(this.target, i, baseTexture.format,
        baseTexture.format, baseTexture.type, <HTMLImageElement>source)
    }
    return true
  }
}