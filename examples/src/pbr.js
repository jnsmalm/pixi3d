let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})

app.loader.add("waterbottle", "assets/models/waterbottle/waterbottle.gltf")
app.loader.add("autumn", "assets/environments/autumn.ibl")

let container = app.stage.addChild(new PIXI3D.Container3D())

app.loader.load(() => {
  let model = container.addChild(
    PIXI3D.Model3D.from(app.loader.resources["waterbottle"].gltf))
  model.scale.set(15)
  model.rotationQuaternion.setEulerAngles(0, 0, 20)

  PIXI3D.LightingEnvironment.main.ibl = app.loader.resources["autumn"].ibl

  let rotation = 0
  app.ticker.add(() => {
    container.rotationQuaternion.setEulerAngles(0, rotation++, 0)
  })
})
document.body.appendChild(app.view)