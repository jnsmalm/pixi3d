const path = require("path")
const BrowserSyncPlugin = require("browser-sync-webpack-plugin")

module.exports = env => {
  return {
    entry: "./src/index.ts",
    mode: mode(env),
    devtool: devtool(env),
    plugins: [
      new BrowserSyncPlugin({
        host: "localhost",
        port: 3000,
        server: { baseDir: ["public"] },
        watch: true
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        },
        {
          test: /\.(glsl|vert|frag|gltf)$/,
          use: "raw-loader",
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
          exclude: /node_modules/
        },
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    externals: {
      "pixi.js": "PIXI"
    },
    output: {
      path: path.resolve(__dirname, directory(env)),
      filename: "pixi3d.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }
}

const directory = env => {
  return env.production ? "dist" : "public"
}

const mode = env => {
  return env.production ? "production" : "development"
}

const devtool = env => {
  return env.production ? "" : "inline-source-map"
}