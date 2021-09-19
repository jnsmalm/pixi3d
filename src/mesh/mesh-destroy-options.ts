import { IDestroyOptions } from "pixi.js"

export interface MeshDestroyOptions extends IDestroyOptions {
  geometry?: boolean
  material?: boolean
}