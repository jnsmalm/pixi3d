import { expect } from "chai"

describe("Custom material", () => {

  it("should render correctly when extending material using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
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
          shader.uniforms.u_Model = mesh.worldTransform.array
          shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection.array
          shader.uniforms.u_Color = [255, 0, 255]
        }
        createShader() {
          return new PIXI3D.MeshShader(PIXI.Program.from(vert, frag))
        }
      }
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf, {
        create: () => new CustomMaterial()
      })
      model.y = -0.8
      renderer.render(model)
    }

    await expect(render).to.match("snapshots/cfqth.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })

  it("should render correctly without extending material using pixi *.*.*", async () => {
    let render = (renderer, resources) => {
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
      let material = PIXI3D.Material.from(vert, frag, (mesh, shader) => {
        shader.uniforms.u_Model = mesh.worldTransform.array
        shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection.array
        shader.uniforms.u_Color = [255, 0, 255]
      })
      let model = PIXI3D.Model.from(resources["assets/teapot/teapot.gltf"].gltf, {
        create: () => material
      })
      model.y = -0.8
      renderer.render(model)
    }

    await expect(render).to.match("snapshots/cfqth.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ]
    })
  })

})