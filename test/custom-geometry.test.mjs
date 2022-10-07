import { expect } from "chai"

describe("Custom geometry", () => {

  it("should render correctly", async () => {
    let render = (renderer, resources) => {
      let vert = `
        attribute vec3 a_Position;
        attribute vec3 a_Color;
        varying vec3 v_Color;
        uniform mat4 u_Model;
        uniform mat4 u_ViewProjection;
        void main() {
          v_Color = a_Color;
          gl_Position = u_ViewProjection * u_Model * vec4(a_Position, 1.0);
        }`
      let frag = `
        varying vec3 v_Color;
        void main() {
          gl_FragColor = vec4(v_Color, 1.0);
        }`
      class CustomShader extends PIXI3D.MeshShader {
        createShaderGeometry(geometry) {
          let result = new PIXI.Geometry()
          result.addAttribute("a_Position", geometry.positions.buffer, 3)
          result.addAttribute("a_Color", geometry.colors.buffer, 3)
          return result
        }
      }
      class CustomMaterial extends PIXI3D.Material {
        updateUniforms(mesh, shader) {
          shader.uniforms.u_Model = mesh.worldTransform.toArray()
          shader.uniforms.u_ViewProjection = PIXI3D.Camera.main.viewProjection
        }
        createShader() {
          return new CustomShader(PIXI.Program.from(vert, frag))
        }
      }
      let geometry = Object.assign(new PIXI3D.MeshGeometry3D(), {
        positions: {
          buffer: new Float32Array([
            -3, -2, 0,
            +3, -2, 0,
            +0, +2, 0
          ])
        },
        colors: {
          buffer: new Float32Array([
            0, 0, 1,
            0, 1, 0,
            1, 0, 0
          ])
        }
      })
      let mesh = new PIXI3D.Mesh3D(geometry, new CustomMaterial())
      renderer.render(mesh)
    }
    await expect(render).to.match("snapshots/zvnhw.png", {
      resources: [
        "assets/teapot/teapot.gltf"
      ],
      threshold: 0.17
    })
  })
})