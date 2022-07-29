import { Renderer, RenderTexture } from "@pixi/core"
import { DisplayObject } from "@pixi/display"

export interface CompatibilityVersion {
  installRendererPlugin(name: string, plugin: any): void
  installLoaderPlugin(name: string, plugin: any): void
  render(renderer: Renderer, object: DisplayObject, renderTexture: RenderTexture): void
}