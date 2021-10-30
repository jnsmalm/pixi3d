module.exports = env => {
  return [{
    entry: "./test/index.js",
    mode: "development",
    devServer: {
      contentBase: "./test",
      host: "0.0.0.0"
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js"]
    },
    module: {
      rules: [
        {
          test: /test\.js$/,
          use: {
            loader: "mocha-loader",
            options: {
              timeout: 10000,
              slow: 5000
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: "test-bundle.js",
    }
  }
    , {
    entry: "./src/index.ts",
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
            loader: "url-loader",
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
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: "pixi3d.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  }]
}