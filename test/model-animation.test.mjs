import { expect } from "chai"

describe("Model animation", () => {

  it("should render correctly with transform animation", async () => {
    let render = (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.y = -0.8
      model.animations.forEach(anim => {
        anim.position = 0.25
      })
      model.meshes.forEach(mesh => mesh.skin = undefined)
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/uzvrd.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })
})