declare namespace PIXI {
  interface ILoaderPlugin {
    pre?: (resource: LoaderResource, next: () => void) => void
    use?: (resource: LoaderResource, next: () => void) => void
    add?: () => void
  }
  class Loader {
    add: (options: { name?: string, url: string, parentResource: LoaderResource, metadata?: any }) => void
    static registerPlugin(plugin: ILoaderPlugin): void
  }
  class LoaderResource {
    type: number
    url: string
    extension: string
    name: string
    metadata: any
    data: any
    texture?: Texture | BaseTexture
    static setExtensionXhrType(extname: string, xhrType: string): void
    static get XHR_RESPONSE_TYPE(): { BUFFER: string, JSON: string }
    static get TYPE(): { IMAGE: number, JSON: number }
  }
  class Geometry {
    addAttribute(name: string, data: ArrayBuffer, size: number, normalized?: boolean, type?: number, stride?: number, start?: number): void
    addIndex(indices: ArrayBuffer): void
  }
  class Shader {
    uniforms: any
    constructor(program: Program, uniforms?: {})
    update(): void
  }
  class Program {
    constructor(vert: string, frag: string)
    static from(vert: string, frag: string): Program
  }
  class Mesh {
    start: number
    size: number
    drawMode: number
    geometry: PIXI.Geometry
    shader: PIXI.Shader
    constructor(geometry: PIXI.Geometry, shader: PIXI.Shader, state?: State)
  }
  class DisplayObject {
    transform: Transform
    parent?: Container
    on(event: string, callback: () => void): void
    render(renderer: any): void
    updateTransform(): void
  }
  class Container extends DisplayObject {
    children: any[]
    addChild(child: any): any
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
  class Renderer {
    static registerPlugin(name: string, ctor: any): void
  }
  class ObjectRenderer {
    renderer: any
    constructor(renderer: any)
  }
  class State {
    depthTest: boolean
    clockwiseFrontFace: boolean
    culling: boolean
  }
  class BaseTexture {
    wrapMode: WRAP_MODES
    alphaMode: ALPHA_MODES
    resource: any
    target: number
    type: number
    format: number
    static from(resource: any): BaseTexture
  }
  class Texture {
    static EMPTY: Texture
    static WHITE: Texture
    static from(resource: any): Texture
    baseTexture: BaseTexture
  }
  class CubeTexture {
    valid: boolean
    constructor(resource: any)
    static from(resources: any[]): CubeTexture
    static from(faces: string[]): CubeTexture
  }
  enum WRAP_MODES { REPEAT }
  enum TYPES { FLOAT }
  enum ALPHA_MODES { PREMULTIPLIED_ALPHA }
  enum DRAW_MODES { TRIANGLES }

  namespace resources {
    let INSTALLED: any[]
    class ImageResource {
      constructor(source: any, options?: any)
      upload(renderer: any, baseTexture: any, glTexture: any, source: any): boolean
    }
    class CubeResource extends ImageResource { }
  }
}