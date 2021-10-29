const path = require("path")

module.exports = env => {
  return [{
    entry: "./src/index.ts",
    devtool: "source-map",
    mode: "development",
    devServer: {
      contentBase: "./serve",
      host: "0.0.0.0"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
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
        {
          test: /\.(glsl|vert|frag)$/,
          use: "webpack-glsl-loader",
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".ts", ".js", ".glsl", ".vert", ".frag"]
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
      filename: "pixi3d.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }, {
    entry: "./serve/src/index.js",
    devtool: "source-map",
    mode: "development",
    devServer: {
      contentBase: "./serve"
    },
    resolve: {
      extensions: [".ts", ".js"]
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    }
  }]
}