import { Compatibility } from "../compatibility/compatibility"
import { LoaderResourceResponseType } from "../compatibility/compatibility-version"
import { settings } from "@pixi/settings"

const EXTENSIONS = ["glsl", "vert", "frag"]

export const ShaderSourceLoader = {
  use: (resource: any, next: () => void) => {
    next()
  },
  add: function () {
    for (let ext of EXTENSIONS) {
      Compatibility.setLoaderResourceExtensionType(ext,
        LoaderResourceResponseType.text)
    }
  },
  test(url: string): boolean {
    return url.includes(".glsl") || url.includes(".vert") || url.includes(".frag")
  },
  async load(url: string): Promise<string> {
    const response = await settings.ADAPTER.fetch(url)
    return await response.text()
  },
}

Compatibility.installLoaderPlugin("shader", ShaderSourceLoader)