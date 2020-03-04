const { Mesh3D, Container3D } = PIXI3D

let app = new PIXI.Application({
  antialias: true, backgroundColor: 0x888888, resizeTo: window
})

let container = app.stage.addChild(new Container3D())

let container2 = container.addChild(new Container3D())

app.loader.load(() => {
  container2.addChild(Mesh3D.createCube())
  container.rotation.setEulerAngles(45, 0, 0)
  container2.scale.set(2,1,1)
})

let rotation = 0
app.ticker.add(() => {
  container2.rotation.setEulerAngles(0, 0, rotation++)
})

document.body.appendChild(app.view)