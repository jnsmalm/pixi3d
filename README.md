# pixi3d
Render in 3D using PixiJS

## Getting started

*index.html*
```
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
```
const { Camera3D, Model3D } = PIXI3D

let app = new PIXI.Application({ width:800, height:600 })

Camera3D.main.aspectRatio = 800 / 600

app.loader.add("cube.gltf")
app.loader.load(() => {
  let model = app.stage.addChild(Model3D.from("cube.gltf"))
})
document.body.appendChild(app.view)
```