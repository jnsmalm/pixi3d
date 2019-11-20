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

let app = new PIXI.Application({ width:800, height:600 })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
app.loader.load(() => {
  let model = app.stage.addChild(Model3D.from("cube.gltf"))
})
document.body.appendChild(app.view)
```

## Custom shader

*index.html*
```html
<!doctype html>
<html lang="en">
<body>
  <script id="color-vert" type="x-shader/x-vertex">
    attribute vec3 position;

    uniform mat4 world;
    uniform mat4 viewProjection;

    void main() {
      gl_Position = viewProjection * world * vec4(position, 1.0);
    }
  </script>
  <script id="color-frag" type="x-shader/x-vertex">
    uniform vec3 color;

    void main() {
      gl_FragColor = vec4(color, 1.0);
    }
  </script>
  <script type="text/javascript" src="pixi.js"></script>
  <script type="text/javascript" src="pixi3d.js"></script>
  <script type="text/javascript" src="app.js"></script>
</body>
</html>
```

*app.js*
```javascript
const { Camera3D, Model3D, Material } = PIXI3D

class ColorShader extends PIXI.Shader {
  constructor() {
    super(PIXI.Program.from(
      document.getElementById("color-vert").textContent,
      document.getElementById("color-frag").textContent
    ))
  }

  updateUniforms(mesh) {
    this.uniforms.world = mesh.transform.worldTransform.array
    this.uniforms.viewProjection = Camera3D.main.viewProjection
    this.uniforms.color = mesh.material.color
  }

  createMaterial() {
    return new ColorMaterial()
  }

  createGeometry(data) {
    let geometry = new PIXI.Geometry()
    geometry.addAttribute("position", data.positions.buffer)
    geometry.addIndex(data.indices.buffer)
    return geometry
  }
}

class ColorMaterial extends Material {
  constructor() {
    super()
    this.color = [0.8, 0.2, 0.7]
  }
}

let app = new PIXI.Application({ antialias: true })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
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