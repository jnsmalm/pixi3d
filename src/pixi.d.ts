declare namespace PIXI {
  interface ILoaderPlugin {
    pre?: (resource: LoaderResource, next: () => void) => void
    use?: (resource: LoaderResource, next: () => void) => void
    add?: () => void
  }
  class Loader {
    add: (options: { name: string, url: string, parentResource: LoaderResource, metadata: any }) => void
    static registerPlugin(plugin: ILoaderPlugin): void
  }
  class LoaderResource {
    url: string
    extension: string
    name: string
    metadata: any
    data: any
    static setExtensionXhrType(extname: string, xhrType: string): void
    static get XHR_RESPONSE_TYPE(): { BUFFER: string, JSON: string }
  }
  class Geometry {
    addAttribute(name: string, data: ArrayBuffer, size: number): void
    addIndex(indices: ArrayBuffer): void
  }
  class Shader {
    uniforms: any
    constructor(program: Program)
  }
  class Program {
    static from(vert: string, frag: string): Program
  }
  class Mesh {
    geometry: PIXI.Geometry
    shader: PIXI.Shader
    constructor(geometry: PIXI.Geometry, shader: PIXI.Shader)
  }
  class Container {
    parent?: Container
    addChild(child: any): any
    render(renderer: any): void
    updateTransform(): void
  }
  class Transform {
    _localID: number
    _worldID: number
    _currentLocalID: number
    _parentID: number
    onChange: () => void
  }
  class ObservablePoint {
    _x: number
    _y: number
    x: number
    y: number
    cb: () => void
    scope: any
    constructor(cb: () => void, scope: any, x: number, y: number)
  }
}