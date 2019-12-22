export namespace PhysicallyBasedProgram {
  export function build(renderer: any, features: string[]) {
    let environment = "webgl1"
    if (renderer.context.webGLVersion === 2) {
      environment = "webgl2"
    }
    let vert: string = require(`./${environment}/primitive.vert`).default
    let frag: string = require(`./${environment}/metallic-roughness.frag`).default

    return PIXI.Program.from(
      PhysicallyBasedMaterialProgramSource.build(vert, features, environment),
      PhysicallyBasedMaterialProgramSource.build(frag, features, environment))
  }
}

namespace PhysicallyBasedMaterialProgramSource {
  const FEATURES = /#define FEATURES/
  const INCLUDES = /#include <(.+)>/gm

  export function build(source: string, features: string[], environment: string) {
    let match: RegExpExecArray | null
    while ((match = INCLUDES.exec(source)) !== null) {
      source = source.replace(match[0], require(`./${environment}/${match[1]}`).default)
    }
    return source.replace(FEATURES,
      features.map(value => `#define ${value}`).join("\n"))
  }
}