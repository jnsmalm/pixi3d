let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

app.loader.add("diffuse.cubemap", "assets/environments/footprint_court/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/footprint_court/specular.cubemap")
app.loader.add("suzanne.gltf", "assets/models/suzanne/suzanne.gltf")

app.loader.load((loader, resources) => {
  // Creates the model which will be used for creating the instances.
  let model = app.stage.addChild(
    PIXI3D.Model.from(resources["suzanne.gltf"].gltf))

  for (let mesh of model.meshes) {
    mesh.material.metallic = 0
    mesh.material.roughness = 0.5
  }

  for (let i = 0; i < 500; i++) {
    // Creates an instance of the model and sets a random position, rotation 
    // and color for that instance.
    let copy = app.stage.addChild(model.createInstance())
    copy.position.x = -20 + Math.random() * 40
    copy.position.y = -10 + Math.random() * 20
    copy.position.z = -20 + Math.random() * 40
    copy.rotationQuaternion.setEulerAngles(0, Math.random() * 360, 0)
    for (let mesh of copy.meshes) {
      mesh.material.baseColor.r = Math.random()
      mesh.material.baseColor.g = Math.random()
      mesh.material.baseColor.b = Math.random()
    }
  }

  let imageBasedLighting = new PIXI3D.ImageBasedLighting(
    resources["diffuse.cubemap"].cubemap,
    resources["specular.cubemap"].cubemap)

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(app.renderer, imageBasedLighting)
})

let control = new PIXI3D.CameraOrbitControl(app.view)

let rotation = 0
app.ticker.add(() => {
  control.angles.y += 0.5
})