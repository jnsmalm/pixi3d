import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

describe("glTF", () => {
  it("should display separate correctly", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-separate.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }, [
      "assets/teapot/teapot-separate.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/wdhdo.png"))
  })
  
  it("should display binary correctly", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-binary.glb"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }, [
      "assets/teapot/teapot-binary.glb"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/wdhdo.png"))
  })

  it("should display embedded correctly", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-embedded.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }, [
      "assets/teapot/teapot-embedded.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/wdhdo.png"))
  })
})