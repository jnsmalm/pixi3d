# Pixi3D
Render in 3D using PixiJS

## Getting started

*index.html*
```html
<!doctype html>
<html lang="en">
<body>
  <script type="text/javascript" src="pixi.js"></script>
  <script type="text/javascript" src="pixi3d.js"></script>
  <script type="text/javascript" src="app.js"></script>
</body>
</html>
```

*app.js*
```javascript
const { Camera3D, Model3D } = PIXI3D

let app = new PIXI.Application({ width: 800, height: 600 })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
app.loader.load(() => {
  let model = app.stage.addChild(Model3D.from("cube.gltf"))
})
document.body.appendChild(app.view)
```

## Custom material

*color-shader.vert*
```glsl
attribute vec3 position;

uniform mat4 world;
uniform mat4 viewProjection;

void main() {
  gl_Position = viewProjection * world * vec4(position, 1.0);
}
```

*color-shader.frag*
```glsl
uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
```

*app.js*
```javascript
const { Camera3D, Model3D, Material } = PIXI3D

class ColorMaterial extends Material {
  constructor() {
    super(["position"])
  }

  updateUniforms(shader) {
    shader.uniforms.world = this.mesh.transform.worldTransform.array
    shader.uniforms.viewProjection = Camera3D.main.viewProjection
    shader.uniforms.color = [0.8, 0.2, 0.7]
  }

  createShader() {
    return new PIXI.Shader(PIXI.Program.from(
      app.loader.resources["color-shader.vert"].source,
      app.loader.resources["color-shader.frag"].source
    ))
  }

  static create() {
    return new ColorMaterial()
  }
}

let app = new PIXI.Application({ width: 800, height: 600, antialias: true })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
app.loader.add("color-shader.vert")
app.loader.add("color-shader.frag")

app.loader.load(() => {
  let model = app.stage.addChild(
    Model3D.from("cube.gltf", { materialFactory: ColorMaterial })
  )
})

document.body.appendChild(app.view)
```

## Cubemaps

PIXI3D supports loading cubemaps from file. It expects 6 images which all share the same filename format (example below). `{{face}}` will be replaced with the following strings: "posx", "negx", "posy", "negy", "posz" and "negz". It can also contain optional mipmaps.

*environment.cubemap*
```json
{
  "source": "folder/environment_{{face}}_128x128.jpg",
  "mipmap": [
    "folder/environment_{{face}}_64x64.jpg",
    "folder/environment_{{face}}_32x32.jpg",
    "folder/environment_{{face}}_16x16.jpg"
  ]
}
```

*app.js*
```javascript
app.loader.add("environment.cubemap")
app.loader.load(() => {
  let texture = app.loader.resources["environment.cubemap"].texture
})
```

## Image based lighting

Cmft (https://github.com/dariomanesku/cmft) is a tool which can generate radiance and irradiance cubemaps to be used as diffuse and specular image based lighting.

*Diffuse (irradiance)*
```
% cmft --input environment.hdr --filter irradiance --inputGammaDenominator 2.2  --outputNum 1 --output0 diffuse --output0params tga,bgra8,facelist

bin/cmft --input input/autumn_forest_01_2k.hdr --filter irradiance --inputGammaDenominator 2.2  --outputNum 1 --output0 diffuse --output0params tga,bgra8,facelist

% mogrify -format jpg *.tga
```

*Specular (radiance)*
```
% cmft --input environment.hdr --filter radiance --srcFaceSize 256 --dstFaceSize 256 --excludeBase true --glossScale 10 --glossBias 1 --lightingModel phongbrdf --useOpenCL true --inputGammaDenominator 2.2 --outputNum 1 --output0 specular --output0params tga,bgra8,facelist

bin/cmft --input input/autumn_forest_01_2k.hdr --filter radiance --srcFaceSize 256 --dstFaceSize 256 --excludeBase true --glossScale 10 --glossBias 1 --lightingModel phongbrdf --useOpenCL true --inputGammaDenominator 2.2 --outputNum 1 --output0 specular --output0params tga,bgra8,facelist

% mogrify -format jpg *.tga
```

*environment.ibl*
```json
{
  "diffuse": {
    "source": "diffuse_{{face}}.jpg"
  },
  "specular": {
    "source": "specular_{{face}}_0_256x256.jpg",
    "mipmap": [
      "specular_{{face}}_1_128x128.jpg",
      "specular_{{face}}_2_64x64.jpg",
      "specular_{{face}}_3_32x32.jpg",
      "specular_{{face}}_4_16x16.jpg",
      "specular_{{face}}_5_8x8.jpg",
      "specular_{{face}}_6_4x4.jpg",
      "specular_{{face}}_7_2x2.jpg",
      "specular_{{face}}_8_1x1.jpg",
    ]
  }
}
```

*app.js*
```javascript
app.loader.add("environment.ibl")
app.loader.load(() => {
  LightingEnvironment.main.ibl = app.loader.resources["environment.ibl"].ibl
})
```

## Development

The following command will start a local webserver in "dist" folder and watch all files for changes.
```
> npm install
> npm start
```

## Building

The following command will build *pixi3d.js* in "dist" folder with production settings.
```
> npm install
> npm run build
```