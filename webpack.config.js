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
        server: { baseDir: ["dist"] },
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
          test: /\.vert$/,
          use: "raw-loader",
          exclude: /node_modules/
        },
        {
          test: /\.frag$/,
          use: "raw-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "pixi3d.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }
}

const mode = env => {
  return env.production ? "production" : "development"
}

const devtool = env => {
  return env.production ? "" : "inline-source-map"
}