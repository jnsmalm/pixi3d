import { expect } from "chai"

describe("glTF", () => {
  it("should load json correctly", async () => {
    let loader = new PIXI.Loader()
    loader.add("assets/teapot/teapot.gltf")
    loader.load((_, resources) => {
      let gltf = resources["assets/teapot/teapot.gltf"].gltf
      expect(gltf).to.be.instanceOf(PIXI3D.glTFAsset)
    })
  })
  it("should load binary correctly", async () => {
    let loader = new PIXI.Loader()
    loader.add("assets/teapot/teapot.glb")
    loader.load((_, resources) => {
      let gltf = resources["assets/teapot/teapot.glb"].gltf
      expect(gltf).to.be.instanceOf(PIXI3D.glTFAsset)
    })
  })
})