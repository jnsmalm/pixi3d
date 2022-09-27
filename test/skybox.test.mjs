import { expect } from "chai"

describe("Skybox", () => {

  it("should render correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let skybox = new PIXI3D.Skybox(PIXI3D.Cubemap.fromColors(
        new PIXI3D.Color(1, 0, 1),
        new PIXI3D.Color(0, 1, 0),
        new PIXI3D.Color(0, 0, 1),
        new PIXI3D.Color(1, 1, 0),
        new PIXI3D.Color(1, 0, 0),
        new PIXI3D.Color(0, 1, 1))
      )
      renderer.render(skybox)
    }
    await expect(render).to.match("snapshots/ugdpm.png")
  })
})