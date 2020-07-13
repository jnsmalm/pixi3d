import * as PIXI from "pixi.js"

export class MipMapResource extends PIXI.resources.ArrayResource {
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