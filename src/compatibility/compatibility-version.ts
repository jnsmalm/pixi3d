import type { Renderer, RenderTexture } from "@pixi/core"
import type { InteractionManager } from "@pixi/interaction"
import type { DisplayObject } from "@pixi/display"
import type { AssetsClass } from "@pixi/assets"

export interface CompatibilityVersion {
  get assets(): AssetsClass | undefined
  getInteractionPlugin(renderer: Renderer): InteractionManager | undefined
  installRendererPlugin(name: string, plugin: any): void
  installLoaderPlugin(name: string, plugin: any): void
  render(renderer: Renderer, object: DisplayObject, renderTexture: RenderTexture): void
  isRendererDestroyed(renderer: Renderer): boolean
  setLoaderResourceExtensionType(extension: string, type: LoaderResourceResponseType): void
}

export enum LoaderResourceResponseType { buffer, json, text }