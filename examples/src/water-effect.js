let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

let control = new PIXI3D.CameraOrbitControl(app.view)
control.distance = 6
control.angles.set(25, 45)

app.loader.add("water.vert", "assets/shaders/water/water.vert")
app.loader.add("water.frag", "assets/shaders/water/water.frag")
app.loader.add("diffuse.cubemap", "assets/environments/footprint_court/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/footprint_court/specular.cubemap")
app.loader.add("water_dudv.jpg", "assets/textures/water_dudv.jpg")

// Create two post processing sprites, one for the default material and one for 
// the water material created below. These two sprites are later used in 
// combination to create the final output.
let sprite1 = new PIXI3D.PostProcessingSprite(app.renderer)
let sprite2 = new PIXI3D.PostProcessingSprite(app.renderer)

let pipeline = app.renderer.plugins.pipeline

// Set the render texture for the default material render pass.
pipeline.materialPass.renderTexture = sprite1.renderTexture

// Create a new water render pass and set the render texture
let waterPass = new PIXI3D.MaterialRenderPass(app.renderer, "water")
pipeline.renderPasses.push(waterPass)
waterPass.renderTexture = sprite2.renderTexture

app.loader.load((loader, resources) => {
  let cube = app.stage.addChild(PIXI3D.Mesh3D.createCube())
  cube.material.roughness = 0.95

  // Create the plane used as water. It will be rendered using the water pass
  // and the water material.
  let water = app.stage.addChild(PIXI3D.Mesh3D.createPlane())

  // Clear all render passes and enable the only render pass we want.
  water.enabledRenderPasses = {}
  water.enableRenderPass(waterPass.name)

  water.material = new WaterMaterial(resources["water_dudv.jpg"].texture, sprite1.renderTexture, sprite1.depthTexture)
  water.scale.set(10, 1, 10)
  water.material.doubleSided = true

  let gui = new dat.GUI()
  gui.add(water.material, "transparency", 0, 1)
  gui.addColor(water.material, "color")

  app.stage.addChild(sprite1)
  app.stage.addChild(sprite2)

  app.ticker.add(() => {
    water.material.animationTime += 0.002
  })

  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(app.renderer, new PIXI3D.ImageBasedLighting(
      resources["diffuse.cubemap"].cubemap,
      resources["specular.cubemap"].cubemap))
})

class WaterMaterial extends PIXI3D.Material {
  constructor(waterTexture, sceneColorTexture, sceneDepthTexture) {
    super()

    this.sceneColorTexture = sceneColorTexture
    this.sceneDepthTexture = sceneDepthTexture

    this.waterTexture = waterTexture
    this.waterTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT

    this.animationTime = 0;
    this.color = [128, 174, 240]
    this.transparency = 0.5
  }

  updateUniforms(mesh, shader) {
    shader.uniforms.u_World = mesh.worldTransform.toArray()
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
    shader.uniforms.u_Scene = this.sceneColorTexture
    shader.uniforms.u_SceneDepth = this.sceneDepthTexture
    shader.uniforms.u_WaterDUDV = this.waterTexture
    shader.uniforms.u_ViewSize = [app.renderer.width, app.renderer.height]
    shader.uniforms.u_AnimationTime = this.animationTime
    shader.uniforms.u_WaterColor = this.color.map(c => c / 255)
    shader.uniforms.u_Transparency = this.transparency
  }

  createShader() {
    let program = PIXI.Program.from(
      app.loader.resources["water.vert"].data, app.loader.resources["water.frag"].data)
    return new PIXI3D.MeshShader(program)
  }
}