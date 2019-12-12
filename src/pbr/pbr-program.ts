export namespace PhysicallyBasedProgram {
  export function build(features: string[]) {
    let vert: string = require("./glsl/primitive.vert").default
    let frag: string = require("./glsl/metallic-roughness.frag").default

    return new Program(
      PhysicallyBasedMaterialProgramSource.build(vert, features),
      PhysicallyBasedMaterialProgramSource.build(frag, features))
  }
}

class Program extends PIXI.Program {
  static PIXI_EXTRACT_DATA = /PIXI_EXTRACT_DATA_OFF/
  constructor(vertexSrc: string, fragmentSrc: string) {
    super(vertexSrc, fragmentSrc)
  }
  extractData(vertexSrc: string, fragmentSrc: string) {
    fragmentSrc = fragmentSrc.replace(Program.PIXI_EXTRACT_DATA, "PIXI_EXTRACT_DATA_ON 1")
    super.extractData(vertexSrc, fragmentSrc)
  }
}

namespace PhysicallyBasedMaterialProgramSource {
  const INSERT = /#define INSERT/
  const IMPORT = /#include <(.+)>/gm

  export function build(source: string, features: string[]) {
    let match: RegExpExecArray | null
    while ((match = IMPORT.exec(source)) !== null) {
      source = source.replace(match[0], require(`./glsl/${match[1]}`).default)
    }
    return source.replace(INSERT,
      features.map(value => `#define ${value}`).join("\n"))
  }
}