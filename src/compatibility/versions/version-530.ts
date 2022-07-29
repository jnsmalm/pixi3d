import { Renderer, RenderTexture } from "@pixi/core"
import { Loader } from "@pixi/loaders"
import { DisplayObject } from "@pixi/display"
import { CompatibilityVersion } from "../compatibility-version"

export class Version530 implements CompatibilityVersion {
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