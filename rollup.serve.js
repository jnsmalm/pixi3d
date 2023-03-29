import config from "./rollup.build"
import resolve from '@rollup/plugin-node-resolve'
import serve from "rollup-plugin-serve"
import commonjs from '@rollup/plugin-commonjs'

config.push({
  input: "serve/src/index.js",
  output: {
    file: "serve/bundle.js",
  },
  plugins: [
    resolve(),
    commonjs(),
    serve({
      host: "0.0.0.0",
      port: 8080,
      open: true,
      contentBase: [
        "dist/browser",
        "serve"
      ]
    })
  ]
})

export default config