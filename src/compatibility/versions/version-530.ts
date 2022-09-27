import { Renderer, RenderTexture } from "@pixi/core"
import type { InteractionManager } from "@pixi/interaction"
import type { DisplayObject } from "@pixi/display"
import { CompatibilityVersion, LoaderResourceResponseType } from "../compatibility-version"
import type { AssetsClass } from "@pixi/assets"

// #if _PIXI_COMPATIBILITY_LOADERS
import { Loader, LoaderResource } from "@pixi/loaders"
// #endif

export class Version530 implements CompatibilityVersion {
  setLoaderResourceExtensionType(extension: string, type: LoaderResourceResponseType): void {
    let responseType = LoaderResource.XHR_RESPONSE_TYPE.TEXT
    if (type === LoaderResourceResponseType.buffer) {
      responseType = LoaderResource.XHR_RESPONSE_TYPE.BUFFER
    } else if (type === LoaderResourceResponseType.json) {
      responseType = LoaderResource.XHR_RESPONSE_TYPE.JSON
    }
    LoaderResource.setExtensionXhrType(extension, responseType)
  }
  getInteractionPlugin(renderer: Renderer): InteractionManager | undefined {
    return renderer.plugins.interaction
  }
  get assets(): AssetsClass | undefined {
    return undefined
  }
  isRendererDestroyed(renderer: Renderer): boolean {
    return !renderer.gl
  }
  installRendererPlugin(name: string, plugin: any): void {
    Renderer.registerPlugin(name, plugin)
  }
  installLoaderPlugin(name: string, plugin: any): void {
    Loader.registerPlugin(plugin)
  }
  render(renderer: Renderer, object: DisplayObject, renderTexture: RenderTexture): void {
    renderer.render(object, renderTexture)
  }
}