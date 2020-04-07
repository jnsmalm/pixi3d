const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
  return {
    entry: {
      pixi3d: "./src/index.ts",
      example: "./examples/src/" + env.example + ".js"
    },
    devtool: "source-map",
    mode: "development",
    devServer: {
      contentBase: "./examples"
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./examples/index.html"
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
      "pixi.js": {
        commonjs: "pixi.js",
        commonjs2: "pixi.js",
        amd: "pixi.js",
        root: "PIXI"
      }
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }
}