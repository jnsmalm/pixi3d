import * as PIXI from "pixi.js"

import { CubeMapResource } from "./cubemap-loader"

export class ImageMipMapResource extends PIXI.resources.ImageResource {
  private _valid = false

  mipmap: PIXI.Texture[] = []

  constructor(source: CubeMapResource) {
    super(source.source)
    if (source.mipmap) {
      for (let i = 0; i < source.mipmap.length; i++) {
        this.mipmap.push(PIXI.Texture.from(source.mipmap[i]))
      }
    }
  }

  get valid() {
    if (this._valid) {
      return true
    }
    for (let i = 0; i < this.mipmap.length; i++) {
      if (!this.mipmap[i].valid) {
        return false
      }
    }
    return this._valid = true
  }

  upload(renderer: PIXI.Renderer, baseTexture: PIXI.BaseTexture, glTexture: PIXI.GLTexture) {
    if (!super.upload(renderer, baseTexture, glTexture)) {
      return false
    }
    for (let i = 0; i < this.mipmap.length; i++) {
      let data = (<any>this.mipmap[i].baseTexture.resource).source
      renderer.gl.texImage2D(baseTexture.target, i + 1, baseTexture.format,
        baseTexture.format, baseTexture.type, data)
    }
    return true;
  }

  static test(source: any) {
    return typeof source === "object" && typeof source.source === "string" &&
      Array.isArray(source.mipmap)
  }

  static install() {
    if (PIXI.resources.INSTALLED.indexOf(ImageMipMapResource) < 0) {
      PIXI.resources.INSTALLED.push(ImageMipMapResource)
    }
  }
}