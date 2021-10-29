import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Model animation", () => {
  it("should render correctly with transform animation", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.animations.forEach(anim => {
        anim.position = 0.25
      })
      model.meshes.forEach(mesh => mesh.skin = undefined)
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/uzvrd.png"))
  })
})