import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Standard material", () => {
  it("should render correctly with ibl and no textures", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
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
    }, [
      "assets/teapot/teapot.gltf",
      "assets/chromatic/specular.cubemap",
      "assets/chromatic/diffuse.cubemap"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/acfkf.png"))
  })
  it("should render transparency correctly", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
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
    }, [
      "assets/teapot/teapot.gltf",
      "assets/chromatic/specular.cubemap",
      "assets/chromatic/diffuse.cubemap"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/odqxx.png"))
  })
})