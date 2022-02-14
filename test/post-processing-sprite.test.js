import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("Post processing sprite", () => {
  it("should render correctly with blur filter", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8

      let sprite = new PIXI3D.PostProcessingSprite(renderer)
      sprite.renderObject(model)
      sprite.filters = [new PIXI.filters.BlurFilter()]

      renderer.render(sprite)
    }, [
      "assets/teapot/teapot.gltf",
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/omohh.png"))
  })
  it("should render correctly after changing resolution", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8

      let sprite = new PIXI3D.PostProcessingSprite(renderer)
      sprite.setResolution(0.1)
      sprite.renderObject(model)

      renderer.render(sprite)
    }, [
      "assets/teapot/teapot.gltf",
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/qsoqc.png"))
  })
  it("should not try to render when renderer was destroyed", async () => {
    let renderer = new PIXI.Renderer()
    let sprite = new PIXI3D.PostProcessingSprite(renderer, {
      objectToRender: PIXI3D.Mesh3D.createCube()
    })
    renderer.destroy()
  })
})