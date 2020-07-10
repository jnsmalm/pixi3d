let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("waterbottle.gltf", "assets/models/waterbottle/waterbottle.gltf")
app.loader.add("diffuse.cubemap", "assets/environments/autumn/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/autumn/specular.cubemap")

let container = app.stage.addChild(new PIXI3D.Container3D())

app.loader.load((loader, resources) => {
  let model = container.addChild(
    PIXI3D.Model3D.from(resources["waterbottle.gltf"].gltf))
  model.scale.set(15)
  model.rotationQuaternion.setEulerAngles(0, 0, 20)

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(new PIXI3D.ImageBasedLighting(
      resources["diffuse.cubemap"].texture,
      resources["specular.cubemap"].texture))

  let rotation = 0
  app.ticker.add(() => {
    container.rotationQuaternion.setEulerAngles(0, rotation++, 0)
  })
})