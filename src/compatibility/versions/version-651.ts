import * as PixiCore from "@pixi/core"

import { Renderer, RenderTexture } from "@pixi/core"
import { DisplayObject } from "@pixi/display"
import { CompatibilityVersion } from "../compatibility-version"

export class Version651 implements CompatibilityVersion {
  installRendererPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: PixiCore.ExtensionType.RendererPlugin,
      name: name
    }
    PixiCore.extensions.add(plugin)
  }
  installLoaderPlugin(name: string, plugin: any): void {
    plugin.extension = {
      type: PixiCore.ExtensionType.Loader,
      name: name
    }
    PixiCore.extensions.add(plugin)
  }
  render(renderer: Renderer, object: DisplayObject, renderTexture: RenderTexture): void {
    renderer.render(object, { renderTexture: renderTexture })
  }
}