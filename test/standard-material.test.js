import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Standard material", () => {
  it("should render correctly with ibl and no textures (01)", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      PIXI3D.LightingEnvironment.main.imageBasedLighting = new PIXI3D.ImageBasedLighting(
        resources["assets/chromatic/diffuse.cubemap"].cubemap,
        resources["assets/chromatic/specular.cubemap"].cubemap
      )
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf",
      "assets/chromatic/specular.cubemap",
      "assets/chromatic/diffuse.cubemap"
    ])
    let compare = "snapshots/standard-material-01.png"
    expect(render).to.match(await getImageDataFromUrl(compare))
  })
})