let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let control = new PIXI3D.CameraOrbitControl(app.view)

async function load() {
  let gltf = await PIXI.Assets.load("http://localhost:8080/assets/teapot/teapot.gltf")
  let model = app.stage.addChild(PIXI3D.Model.from(gltf))
}

load()