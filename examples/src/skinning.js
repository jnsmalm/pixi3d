let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let control = new PIXI3D.CameraOrbitControl(app.view)

app.loader.add("diffuse.cubemap", "assets/environments/footprint_court/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/footprint_court/specular.cubemap")
app.loader.add("skybox.cubemap", "assets/environments/footprint_court/skybox.cubemap")
app.loader.add("stormtrooper.gltf", "assets/dancing_stormtrooper/scene.gltf")

app.loader.load((loader, resources) => {
  let skybox = app.stage.addChild(
    new PIXI3D.Skybox(resources["skybox.cubemap"].cubemap))

  let model = app.stage.addChild(
    PIXI3D.Model.from(resources["stormtrooper.gltf"].gltf))
  model.y = -1.8
  model.animations[0].loop = true
  model.animations[0].play()

  let ground = app.stage.addChild(PIXI3D.Mesh3D.createPlane())
  ground.y = -1.8
  ground.scale.set(15)
  ground.material.roughness = 0.5
  ground.material.metallic = 0

  let imageBasedLighting = new PIXI3D.ImageBasedLighting(
    resources["diffuse.cubemap"].cubemap,
    resources["specular.cubemap"].cubemap)

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(app.renderer, imageBasedLighting)

  let dirLight = Object.assign(new PIXI3D.Light(), {
    type: "directional", intensity: 0.75, x: -4, y: 7, z: -4
  })
  dirLight.rotationQuaternion.setEulerAngles(45, -75, 0)
  PIXI3D.LightingEnvironment.main.lights.push(dirLight)

  let shadowCastingLight = new PIXI3D.ShadowCastingLight(
    app.renderer, dirLight, { shadowTextureSize: 1024, quality: PIXI3D.ShadowQuality.medium })
  shadowCastingLight.softness = 1
  shadowCastingLight.shadowArea = 15

  let pipeline = app.renderer.plugins.pipeline
  pipeline.enableShadows(model, shadowCastingLight)
  pipeline.enableShadows(ground, shadowCastingLight)
})