import { Texture } from "@pixi/core"

export interface CubemapFaces {
  /** The texture or url for positive x. */
  posx: Texture | string
  /** The texture or url for negative x. */
  negx: Texture | string
  /** The texture or url for positive y. */
  posy: Texture | string
  /** The texture or url for negative y. */
  negy: Texture | string
  /** The texture or url for positive z. */
  posz: Texture | string
  /** The texture or url for negative z. */
  negz: Texture | string
}