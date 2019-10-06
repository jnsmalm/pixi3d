export class BasicShader extends PIXI.Shader {
  constructor() {
    super(PIXI.Program.from(vert, frag))
  }
}

const vert = `
  precision mediump float;
  attribute vec3 position;
  uniform mat4 model;
  void main() {
    gl_Position = model * vec4(position, 1.0);
  }
`

const frag = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0, 0, 1.0);
  }
`