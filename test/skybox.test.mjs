import { expect } from "chai"

describe("Skybox", () => {

  it("should render correctly from colors using pixi *.*.*", async () => {
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

  it("should render correctly with cubemap version 1, ldr and exposure = 1 using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let skybox = new PIXI3D.Skybox(
        resources["assets/chromatic/skybox.cubemap"].cubemap)
      skybox.rotationQuaternion.setEulerAngles(-45, 270, 0)
      skybox.exposure = 1
      renderer.render(skybox)
    }
    await expect(render).to.match("snapshots/ygihm.png", {
      resources: [
        "assets/chromatic/skybox.cubemap"
      ]
    })
  })

  it("should render correctly with cubemap version 2, rgbe8 and exposure = 0.1 using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let skybox = new PIXI3D.Skybox(
        resources["assets/sunset/skybox.cubemap"].cubemap)
      skybox.rotationQuaternion.setEulerAngles(0, 130, 0)
      skybox.exposure = 0.1
      renderer.render(skybox)
    }
    await expect(render).to.match("snapshots/sshat.png", {
      resources: [
        "assets/sunset/skybox.cubemap"
      ]
    })
  })

  it("should render correctly with cubemap version 2, rgbe8 and exposure = 0.3 using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
      let skybox = new PIXI3D.Skybox(
        resources["assets/sunset/skybox.cubemap"].cubemap)
      skybox.rotationQuaternion.setEulerAngles(0, 130, 0)
      skybox.exposure = 0.3
      renderer.render(skybox)
    }
    await expect(render).to.match("snapshots/tulow.png", {
      resources: [
        "assets/sunset/skybox.cubemap"
      ]
    })
  })
})