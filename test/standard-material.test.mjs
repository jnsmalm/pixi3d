import { expect } from "chai"

describe("Standard material", () => {

  it("should render correctly with ibl and no textures", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/acfkf.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })

  it("should render transparency correctly", async () => {
    let render = (renderer, resources) => {
      let lightingEnvironment = new PIXI3D.LightingEnvironment(renderer)
      lightingEnvironment.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let container = new PIXI3D.Container3D()
      let model = container.addChild(PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf))
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.lightingEnvironment = lightingEnvironment
      })
      let transparent = container.addChild(PIXI3D.Mesh3D.createQuad())
      transparent.z = 1.5
      transparent.material.baseColor = new PIXI3D.Color(1, 0, 1)
      transparent.material.unlit = true
      transparent.alpha = 0.5
      renderer.render(container)
    }
    await expect(render).to.match("snapshots/odqxx.png", {
      resources: [
        "assets/teapot/teapot.gltf",
        "assets/chromatic/specular.cubemap",
        "assets/chromatic/diffuse.cubemap"
      ]
    })
  })
})