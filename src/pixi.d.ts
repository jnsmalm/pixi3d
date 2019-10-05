declare namespace PIXI {
  interface ILoaderPlugin {
    pre?: (resource: LoaderResource, next: () => void) => void
    use?: (resource: LoaderResource, next: () => void) => void
    add?: () => void
  }
  class Loader {
    add: (options: { name: string, url: string, parentResource: LoaderResource }) => void
    static registerPlugin(plugin: ILoaderPlugin): void
  }
  class LoaderResource {
    url: string
    extension: string
    data: any
    static setExtensionXhrType(extname: string, xhrType: string): void
    static get XHR_RESPONSE_TYPE(): { BUFFER: string, JSON: string }
  }
}