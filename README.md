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

## Custom shader

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
const { Camera3D, Model3D, MeshShader, Material } = PIXI3D

class ColorShader extends MeshShader {
  constructor() {
    let attributes = ["position"]
    super(PIXI.Program.from(
      app.loader.resources["color-shader.vert"].source,
      app.loader.resources["color-shader.frag"].source
    ), attributes)
  }

  createMaterial() {
    return new ColorMaterial()
  }

  updateUniforms(mesh) {
    this.uniforms.world = mesh.transform.worldTransform.array
    this.uniforms.viewProjection = Camera3D.main.viewProjection
    this.uniforms.color = mesh.material.color
  }
}

class ColorMaterial extends Material {
  constructor() {
    super()
    this.color = [0.8, 0.2, 0.7]
  }
}

let app = new PIXI.Application({ width: 800, height: 600, antialias: true })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
app.loader.add("color-shader.vert")
app.loader.add("color-shader.frag")

app.loader.load(() => {
  let model = app.stage.addChild(
    Model3D.from("cube.gltf", { shader: new ColorShader() })
  )
})

document.body.appendChild(app.view)
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