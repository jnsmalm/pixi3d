import * as PixiCore from "@pixi/core"
import type { InteractionManager } from "@pixi/interaction"
import type { Renderer } from "@pixi/core"
import { CompatibilityAccess } from "../compatibility-access"
import type { AssetsClass } from "@pixi/assets"
import { Version650 } from "./version-650"
import { LoaderResourceResponseType } from "../compatibility-version"

// #if _PIXI_COMPATIBILITY_ASSETS
import { Assets } from "@pixi/assets"
// #endif

export class Version700 extends Version650 {
  setLoaderResourceExtensionType(extension: string, type: LoaderResourceResponseType): void {
  }
  getInteractionPlugin(renderer: Renderer): InteractionManager | undefined {
    // Interaction manager was removed in version 7, events is used instead.
    return undefined
  }
  get assets(): AssetsClass | undefined {
    return Assets
  }
  isRendererDestroyed(renderer: Renderer): boolean {
    if ("_systemsHash" in renderer) {
      // @ts-ignore The private property _systemsHash do exist in runtime.
      return Object.keys(renderer._systemsHash).length === 0
    }
    return false
  }
  installRendererPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: [CompatibilityAccess.get(PixiCore, "ExtensionType").RendererPlugin],
      name: name
    }
    CompatibilityAccess.get(PixiCore, "extensions").add(plugin)
  }
  installLoaderPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: [
        CompatibilityAccess.get(PixiCore, "ExtensionType").Loader,
        CompatibilityAccess.get(PixiCore, "ExtensionType").LoadParser
      ],
      name: name
    }
    CompatibilityAccess.get(PixiCore, "extensions").add(plugin)
  }
}