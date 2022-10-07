import { expect } from "chai"

describe("Sprite", () => {

  it("should render correctly without billboard", async () => {
    let render = (renderer, resources) => {
      let sprite = new PIXI3D.Sprite3D(resources["assets/bunnies/rabbitv3.png"].texture)
      sprite.scale.set(10)
      sprite.rotationQuaternion.setEulerAngles(45, 45, 45)
      renderer.render(sprite)
    }
    await expect(render).to.match("snapshots/hhpjd.png", {
      resources: [
        "assets/bunnies/rabbitv3.png"
      ],
      threshold: 0.11
    })
  })

  it("should render correctly with spherical billboard", async () => {
    let render = (renderer, resources) => {
      let sprite = new PIXI3D.Sprite3D(resources["assets/bunnies/rabbitv3.png"].texture)
      sprite.scale.set(10)
      sprite.rotationQuaternion.setEulerAngles(45, 45, 45)
      sprite.billboardType = PIXI3D.SpriteBillboardType.spherical
      renderer.render(sprite)
    }
    await expect(render).to.match("snapshots/xsulf.png", {
      resources: [
        "assets/bunnies/rabbitv3.png"
      ],
      threshold: 0.11
    })
  })

  it("should render correctly with cylindrical billboard", async () => {
    let render = (renderer, resources) => {
      let sprite = new PIXI3D.Sprite3D(resources["assets/bunnies/rabbitv3.png"].texture)
      sprite.scale.set(10)
      sprite.rotationQuaternion.setEulerAngles(45, 45, 45)
      sprite.billboardType = PIXI3D.SpriteBillboardType.cylindrical
      renderer.render(sprite)
    }
    await expect(render).to.match("snapshots/ehxit.png", {
      resources: [
        "assets/bunnies/rabbitv3.png"
      ],
      threshold: 0.11
    })
  })

  it("should render correctly back to front", async () => {
    let render = (renderer, resources) => {
      let container = new PIXI3D.Container3D()
      let sprites = []
      for (let i = 0; i < 3; i++) {
        let sprite = new PIXI3D.Sprite3D(resources["assets/bunnies/rabbitv3.png"].texture)
        sprite.scale.set(5)
        sprite.position.set(0 + i * 0.5, 0, 0 + i * 1)
        sprites.unshift(sprite)
      }
      sprites.forEach(sprite => container.addChild(sprite))
      renderer.render(container)
    }
    await expect(render).to.match("snapshots/aauwp.png", {
      resources: [
        "assets/bunnies/rabbitv3.png"
      ],
      threshold: 0.11
    })
  })
})