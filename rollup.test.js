import config from "./rollup.build"
import resolve from '@rollup/plugin-node-resolve'
import serve from "rollup-plugin-serve"
import commonjs from '@rollup/plugin-commonjs'

config.push({
  input: "test/index.js",
  output: {
    file: "test/bundle.js",
  },
  plugins: [
    resolve(),
    commonjs(),
    serve({
      host: "localhost",
      port: 8080,
      open: true,
      contentBase: [
        "dist",
        "test",
        "node_modules/mocha"
      ]
    })
  ]
})

export default config