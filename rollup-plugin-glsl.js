import { readFileSync } from "fs"
import { resolve, dirname } from "path"

function load(path) {
  let match, source = readFileSync(path, "utf8")
  while ((match = /@import (.*);/g.exec(source)) !== null) {
    let importPath = resolve(dirname(path), match[1]) + ".glsl"
    let importSource = readFileSync(importPath, "utf8")
    source = source.replace(match[0], importSource)
  }
  return source
}

function template(source) {
  return `export var Shader = ${JSON.stringify({ source })};`
}

export default function glsl() {
  return {
    name: "glsl",
    load(id) {
      if (id.includes(".vert") || id.includes(".frag")) {
        return template(load(id))
      }
      return null
    }
  };
}