let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)
globalThis.__PIXI_APP__ = app

let control = new PIXI3D.CameraOrbitControl(app.view)
control.enableDamping = true

app.loader.add("assets/chromatic/diffuse.cubemap")
app.loader.add("assets/chromatic/specular.cubemap")
app.loader.add("assets/teapot/teapot.gltf")

app.loader.load((_, resources) => {
  PIXI3D.LightingEnvironment.main.imageBasedLighting = new PIXI3D.ImageBasedLighting(
    resources["assets/chromatic/diffuse.cubemap"].cubemap,
    resources["assets/chromatic/specular.cubemap"].cubemap
  )

  let model = app.stage.addChild(
    PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
  model.y = -0.8
  model.meshes.forEach(mesh => {
    mesh.material.exposure = 1.3
  })

  let ground = app.stage.addChild(PIXI3D.Mesh3D.createPlane())
  ground.y = -0.8
  ground.scale.set(10, 1, 10)

  let directionalLight = Object.assign(new PIXI3D.Light(), {
    intensity: 1,
    type: "directional"
  })
  directionalLight.rotationQuaternion.setEulerAngles(25, 120, 0)
  PIXI3D.LightingEnvironment.main.lights.push(directionalLight)

  let shadowCastingLight = new PIXI3D.ShadowCastingLight(
    app.renderer, directionalLight, { shadowTextureSize: 1024, quality: PIXI3D.ShadowQuality.medium })
  shadowCastingLight.softness = 1
  shadowCastingLight.shadowArea = 15

  let pipeline = app.renderer.plugins.pipeline
  pipeline.enableShadows(ground, shadowCastingLight)
  pipeline.enableShadows(model, shadowCastingLight)
})