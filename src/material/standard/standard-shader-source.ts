export namespace StandardShaderSource {
  export function build(source: string, features: string[]) {
    let match: RegExpExecArray | null
    while ((match = /#include <(.+)>/gm.exec(source)) !== null) {
      source = source.replace(match[0], require(`./shader/${match[1]}`).default)
    }
    return source.replace(/#define FEATURES/,
      features.map(value => `#define ${value}`).join("\n"))
  }
}