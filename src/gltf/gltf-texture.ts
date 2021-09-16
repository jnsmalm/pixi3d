import { Texture } from "pixi.js"

export interface glTFTexture extends Texture {
  texCoord?: number
  transform?: {
    offset?: [number, number]
    rotation?: number
    scale?: [number, number]
  }
}