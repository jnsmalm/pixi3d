const path = require("path")
const package = require('../package.json');

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

console.log(externals);

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
    externals: externals,
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