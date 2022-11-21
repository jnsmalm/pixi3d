import { expect } from "chai"

describe("glTF", () => {

  it("should render separate correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-separate.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/wdhdo.png", {
      resources: [
        "assets/teapot/teapot-separate.gltf"
      ]
    })
  })

  it("should render binary correctly using pixi *.*.*", async () => {
    let render = async (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-binary.glb"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/wdhdo.png", {
      resources: [
        "assets/teapot/teapot-binary.glb"
      ]
    })
  })

  it("should render embedded correctly using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot-embedded.gltf"].gltf)
      model.y = -0.8
      model.meshes.forEach(mesh => {
        mesh.material.unlit = true
      })
      renderer.render(model)
    }
    await expect(render).to.match("snapshots/wdhdo.png", {
      resources: [
        "assets/teapot/teapot-embedded.gltf"
      ]
    })
  })
})