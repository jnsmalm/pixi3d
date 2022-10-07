import { expect } from "chai"

describe("Camera", () => {

  it("should render correctly with obliqueness", async () => {
    let render = (renderer, resources) => {
      let camera = new PIXI3D.Camera(renderer)
      camera.obliqueness.y = 1
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf)
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
        mesh.material.baseColor = new PIXI3D.Color(1, 0, 1)
        mesh.material.camera = camera
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/swece.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })
})