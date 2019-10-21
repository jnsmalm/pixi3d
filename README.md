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