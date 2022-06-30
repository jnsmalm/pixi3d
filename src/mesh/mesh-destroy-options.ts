import { IDestroyOptions } from "@pixi/display"

export interface MeshDestroyOptions extends IDestroyOptions {
  geometry?: boolean
  material?: boolean
}