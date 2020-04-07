let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
let box = app.stage.addChild(PIXI3D.Mesh3D.createCube())

let rotation = 0
app.ticker.add(() => {
  box.rotationQuaternion.setEulerAngles(0, rotation++, 0)
})
document.body.appendChild(app.view)