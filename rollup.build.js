const pkg = require('./package.json')

import typescript from "@rollup/plugin-typescript"
import image from "@rollup/plugin-image"
import resolve from '@rollup/plugin-node-resolve'
import glsl from "./rollup-plugin-glsl"
import { terser } from "rollup-plugin-terser"

const packages = [
  "@pixi/constants",
  "@pixi/core",
  "@pixi/display",
  "@pixi/loaders",
  "@pixi/math",
  "@pixi/settings",
  "@pixi/sprite",
  "@pixi/ticker",
  "@pixi/utils"
]

const globals = {}
packages.forEach(function (key) {
  globals[key] = key === "@pixi/utils" ? "PIXI.utils" : "PIXI"
})
const banner = `/* Pixi3D v${pkg.version} */`
const minify = terser({
  output: {
    comments: (_, comment) => comment.line === 1
  }
})

const plugins = [
  typescript({ noEmitOnError: true }),
  image(),
  glsl(),
  resolve()
]

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
    },
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
  external: packages,
  plugins
}]