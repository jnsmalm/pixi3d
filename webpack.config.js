const package = require('./package.json')
const webpack = require("webpack")

const externals = {};
Object.keys(package.peerDependencies).forEach(function(key) {
  const { namespace = "PIXI" } = require(`${key}/package.json`);
  externals[key] = {
    commonjs: key,
    commonjs2: key,
    amd: key,
    root: namespace.split('.'),
  }
})

const shared = {
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
  plugins: [
    new webpack.BannerPlugin({ banner: `Pixi3D v${package.version}` })
  ],
  resolve: {
    extensions: [".ts", ".js", ".glsl", ".vert", ".frag"]
  },
  externals: externals
}

module.exports = [
  Object.assign({ ...shared }, {
    mode: "development",
    devtool: "inline-source-map",
    output: {
      filename: "pixi3d.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true,
      pathinfo: false
    }
  }),
  Object.assign({ ...shared }, {
    mode: "production",
    output: {
      filename: "pixi3d.min.js",
      library: "PIXI3D",
      libraryTarget: "umd",
      umdNamedDefine: true
    }
  })
]