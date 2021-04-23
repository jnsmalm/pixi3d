import * as PIXI from "pixi.js"

export interface CubemapFaces {
  /** The texture or url for positive x. */
  posx: PIXI.Texture | string
  /** The texture or url for negative x. */
  negx: PIXI.Texture | string
  /** The texture or url for positive y. */
  posy: PIXI.Texture | string
  /** The texture or url for negative y. */
  negy: PIXI.Texture | string
  /** The texture or url for positive z. */
  posz: PIXI.Texture | string
  /** The texture or url for negative z. */
  negz: PIXI.Texture | string
}