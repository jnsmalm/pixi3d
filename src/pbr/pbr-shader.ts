export namespace PhysicallyBasedShader {
  export function build(renderer: any, features: string[]) {
    let environment = "webgl1"
    if (renderer.context.webGLVersion === 2) {
      environment = "webgl2"
    }
    let vert = require(`./shader/primitive.${environment}.vert`).default
    let frag = require(`./shader/metallic-roughness.${environment}.frag`).default

    let program = PIXI.Program.from(
      PhysicallyBasedShaderSource.build(vert, features),
      PhysicallyBasedShaderSource.build(frag, features))

    return new PIXI.Shader(program)
  }
}

namespace PhysicallyBasedShaderSource {
  const FEATURES = /#define FEATURES/
  const INCLUDES = /#include <(.+)>/gm

  export function build(source: string, features: string[]) {
    let match: RegExpExecArray | null
    while ((match = INCLUDES.exec(source)) !== null) {
      source = source.replace(match[0], require(`./shader/${match[1]}`).default)
    }
    return source.replace(FEATURES,
      features.map(value => `#define ${value}`).join("\n"))
  }
}