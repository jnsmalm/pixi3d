import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "../compatibility-access"
import { Version600 } from "./version-600"

export class Version650 extends Version600 {
  installRendererPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: CompatibilityAccess.get(PixiCore, "ExtensionType").RendererPlugin,
      name: name
    }
    CompatibilityAccess.get(PixiCore, "extensions").add(plugin)
  }
  installLoaderPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: CompatibilityAccess.get(PixiCore, "ExtensionType").Loader,
      name: name
    }
    CompatibilityAccess.get(PixiCore, "extensions").add(plugin)
  }
}