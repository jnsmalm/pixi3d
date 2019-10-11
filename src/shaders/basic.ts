import { mat3 } from "gl-matrix"
import { Matrix } from "../matrix"
import { Transform3D } from "../transform"
import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { Shader } from "../shader"
import { DirectionalLight } from "../light"

export class BasicShader extends PIXI.Shader implements Shader {
  private _transposedInversedWorld = mat3.create()

  transform: Transform3D | undefined
  color = [1, 1, 1]
  directionalLight = new DirectionalLight()
  texture: PIXI.Texture | undefined

  constructor(public camera = Camera3D.main) {
    super(PIXI.Program.from(vert, frag))
  }

  update() {
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform
      this.uniforms.transposedInversedWorld = Matrix.transposedInversedWorld(
        this.transform.worldTransform, this._transposedInversedWorld)
    }
    this.uniforms.texture = this.texture
    this.uniforms.viewProjection = this.camera.viewProjection
    this.uniforms.color = this.color

    this.directionalLight.transform.updateLocalTransform()
    this.uniforms.lightPosition = this.directionalLight.transform.localPosition
  }

  createGeometry(data: MeshData) {
    let geometry = new PIXI.Geometry()
    geometry.addAttribute("position", data.positions, 3)
    geometry.addAttribute("normal", data.normals, 3)
    geometry.addAttribute("texCoords", data.texCoords, 2)
    geometry.addIndex(new Uint16Array(data.indices))
    return geometry
  }
}

const vert = `
  precision mediump float;
  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 texCoords;
  varying vec3 vNormal;
  varying vec2 vTexCoords;
  uniform mat4 world;
  uniform mat3 transposedInversedWorld;
  uniform mat4 viewProjection;
  void main() {
    gl_Position = viewProjection * world * vec4(position, 1.0);
    vNormal = transposedInversedWorld * normal;
    vTexCoords = texCoords;
  }
`

const frag = `
  precision mediump float;
  varying vec3 vNormal;
  varying vec2 vTexCoords;
  uniform vec3 color;
  uniform vec3 lightPosition;
  uniform sampler2D texture;
  void main() {
    vec3 light = normalize(lightPosition);

    // calculate the dot product of
    // the light to the vertex normal
    float dProd = max(0.0, dot(vNormal, light));
  
    // feed into our frag colour
    //gl_FragColor = vec4(dProd * color.r, dProd * color.g, dProd * color.b, 1.0);

    vec2 tex = vec2(vTexCoords.x, vTexCoords.y);

    gl_FragColor = texture2D(texture, tex);
  }
`