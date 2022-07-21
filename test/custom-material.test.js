import { expect } from "chai"
import { getImageDataFromRender, getImageDataFromUrl } from "./test-utils"

let vert = `
  attribute vec3 a_Position;
  uniform mat4 u_Model;
  uniform mat4 u_ViewProjection;
  void main() {
    gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0);
  }`

let frag = `
  uniform vec3 u_Color;
  void main() {
    gl_FragColor = vec4(u_Color, 1.0);
  }`

class CustomMaterial extends PIXI3D.Material {
  updateUniforms(mesh, shader) {
    shader.uniforms.u_Model = mesh.worldTransform.toArray()
    shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
    shader.uniforms.u_Color = [255, 0, 255]
  }

  createShader() {
    return new PIXI3D.MeshShader(PIXI.Program.from(vert, frag))
  }
}

describe("Custom material", () => {
  it("should render correctly when extending material", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf, {
        create: () => new CustomMaterial()
      })
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/cfqth.png"))
  })
  it("should render correctly without extending material", async () => {
    let render = await getImageDataFromRender((renderer, resources) => {
      let material = PIXI3D.Material.from(vert, frag, (mesh, shader) => {
        shader.uniforms.u_Model = mesh.worldTransform.toArray()
        shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
        shader.uniforms.u_Color = [255, 0, 255]
      })
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf, {
        create: () => material
      })
      model.y = -0.8
      renderer.render(model)
    }, [
      "assets/teapot/teapot.gltf"
    ])
    expect(render).to.match(
      await getImageDataFromUrl("snapshots/cfqth.png"))
  })
})