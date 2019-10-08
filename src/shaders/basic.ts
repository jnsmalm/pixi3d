import { mat4 } from "gl-matrix"
import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { Shader } from "../shader"
import { Transform3D } from "../transform"

export class BasicShader extends PIXI.Shader implements Shader {
  color = [1, 1, 1]
  transform: Transform3D | undefined

  constructor(public camera: Camera3D = Camera3D.main) {
    super(PIXI.Program.from(vert, frag))
  }

  update() {
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform
    }
    this.uniforms.viewProjection = this.camera.viewProjection
    this.uniforms.color = this.color
  }

  createGeometry(data: MeshData) {
    let geometry = new PIXI.Geometry()
    geometry.addAttribute("position", data.positions, 3)
    geometry.addIndex(new Uint16Array(data.indices))
    return geometry
  }
}

const vert = `
  precision mediump float;
  attribute vec3 position;
  uniform mat4 world;
  uniform mat4 viewProjection;
  void main() {
    gl_Position = viewProjection * world * vec4(position, 1.0);
  }
`

const frag = `
  precision mediump float;
  uniform vec3 color;
  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`