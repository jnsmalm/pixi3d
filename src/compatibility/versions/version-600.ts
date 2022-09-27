import type { DisplayObject } from "@pixi/display"
import type { Renderer, RenderTexture } from "@pixi/core"
import { Version530 } from "./version-530"

export class Version600 extends Version530 {
  render(renderer: Renderer, object: DisplayObject, renderTexture: RenderTexture): void {
    renderer.render(object, { renderTexture: renderTexture })
  }
}