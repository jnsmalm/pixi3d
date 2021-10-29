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
})