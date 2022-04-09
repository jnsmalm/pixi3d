import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Skybox", () => {
  it("should render correctly", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let skybox = new PIXI3D.Skybox(PIXI3D.Cubemap.fromColors(
        new PIXI3D.Color(1, 0, 1),
        new PIXI3D.Color(0, 1, 0),
        new PIXI3D.Color(0, 0, 1),
        new PIXI3D.Color(1, 1, 0),
        new PIXI3D.Color(1, 0, 0),
        new PIXI3D.Color(0, 1, 1))
      )
      renderer.render(skybox)
    })
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/ugdpm.png"))
  })
})