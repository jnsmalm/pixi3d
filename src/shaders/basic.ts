import { mat4 } from "gl-matrix"
import { MeshData } from "../mesh"
import { Shader } from "../shader"

export class BasicShader extends PIXI.Shader implements Shader {
  color = [1, 1, 1]
  worldTransform = mat4.create()

  constructor() {
    super(PIXI.Program.from(vert, frag))
  }

  update() {
    this.uniforms.color = this.color
    this.uniforms.world = this.worldTransform
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
  void main() {
    gl_Position = world * vec4(position, 1.0);
  }
`

const frag = `
  precision mediump float;
  uniform vec3 color;
  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`