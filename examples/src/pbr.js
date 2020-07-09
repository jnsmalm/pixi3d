let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("waterbottle.gltf", "assets/models/waterbottle/waterbottle.gltf")
app.loader.add("autumn.ibl", "assets/environments/autumn.ibl")

let container = app.stage.addChild(new PIXI3D.Container3D())

app.loader.load(() => {
  let model = container.addChild(
    PIXI3D.Model3D.from(app.loader.resources["waterbottle.gltf"].gltf))
  model.scale.set(15)
  model.rotationQuaternion.setEulerAngles(0, 0, 20)

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(app.loader.resources["autumn.ibl"].ibl)

  let rotation = 0
  app.ticker.add(() => {
    container.rotationQuaternion.setEulerAngles(0, rotation++, 0)
  })
})