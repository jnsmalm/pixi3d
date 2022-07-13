const pkg = require('./package.json')

import typescript from "@rollup/plugin-typescript"
import image from "@rollup/plugin-image"
import resolve from '@rollup/plugin-node-resolve'
import glsl from "./rollup-plugin-glsl"
import { terser } from "rollup-plugin-terser"

const globals = {}
Object.keys(pkg.peerDependencies).forEach(function (key) {
  const { namespace = "PIXI" } = require(`${key}/package.json`)
  globals[key] = namespace
})

const external = [
  "@pixi/loaders",
  "@pixi/core",
  "@pixi/math",
  "@pixi/display",
  "@pixi/constants",
  "@pixi/ticker",
  "@pixi/utils",
  "@pixi/sprite",
  "@pixi/interaction",
  "@pixi/settings"
]

const banner = `/* Pixi3D v${pkg.version} */`
const minify = terser({
  output: {
    comments: (_, comment) => comment.line === 1
  }
})

const plugins = (target) => {
  return [
    typescript({ target, noEmitOnError: true }),
    image(),
    glsl(),
    resolve()
  ]
}

export default [{
  input: "src/index.ts",
  output: [
    {
      file: "dist/umd/pixi3d.js",
      format: "umd",
      sourcemap: true,
      name: "PIXI3D",
      globals,
      banner
    },
    {
      file: "dist/umd/pixi3d.min.js",
      format: "umd",
      sourcemap: true,
      name: "PIXI3D",
      globals,
      banner,
      plugins: [
        minify
      ]
    }
  ],
  external,
  plugins: plugins("es5")
}, {
  input: "src/index.ts",
  output: [
    {
      file: "dist/esm/pixi3d.js",
      format: "esm",
      sourcemap: true,
      banner
    },
    {
      file: "dist/esm/pixi3d.min.js",
      format: "esm",
      sourcemap: true,
      banner,
      plugins: [
        minify
      ]
    }
  ],
  external,
  plugins: plugins("es5")
}]