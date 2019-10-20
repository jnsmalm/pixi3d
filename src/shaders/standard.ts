import { mat4 } from "gl-matrix"
import { Shader, ShaderFactory } from "../shader"
import { MetallicRoughnessMaterial } from "../material"
import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { Transform3D } from "../transform"
import { LightingEnvironment } from "../light"
import { Matrix } from "../matrix"

export enum StandardShaderAttribute {
  normal = "normal", texCoord = "texCoord"
}

export class StandardShaderFactory implements ShaderFactory {
  createShader(data: MeshData): Shader {
    if (data.normals && !data.texCoords) {
      return new StandardShader([StandardShaderAttribute.normal])
    }
    if (data.normals && data.texCoords) {
      return new StandardShader([
        StandardShaderAttribute.normal,
        StandardShaderAttribute.texCoord
      ])
    }
    if (!data.normals && data.texCoords) {
      return new StandardShader([StandardShaderAttribute.texCoord])
    }
    return new StandardShader()
  }
}

export class StandardShader extends PIXI.Shader implements Shader {
  private _transposedInversedWorld = mat4.create()

  transform: Transform3D | undefined
  material: MetallicRoughnessMaterial | undefined

  constructor(public attributes: StandardShaderAttribute[] = []) {
    super(new GeneratedStandardProgram(attributes))
  }

  update() {
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform
      this.uniforms.transposedInversedWorld = Matrix.transposeInverse(
        this.transform.worldTransform, this._transposedInversedWorld)
    }
    this.uniforms.baseColorTexture = this.baseColorTexture
    this.uniforms.baseColor = this.baseColor
    this.uniforms.directionalLight = this.directionalLight
    this.uniforms.viewProjection = Camera3D.main.viewProjection
  }

  createGeometry(data: MeshData): PIXI.Geometry {
    let geometry = new PIXI.Geometry()
    if (data.positions) {
      geometry.addAttribute("position", data.positions, 3)
    }
    if (data.normals) {
      geometry.addAttribute("normal", data.normals, 3)
    }
    if (data.texCoords) {
      geometry.addAttribute("texCoord", data.texCoords, 2)
    }
    if (data.indices) {
      geometry.addIndex(new Uint16Array(data.indices))
    }
    return geometry
  }

  get baseColor() {
    if (!this.material || !this.material.baseColor) {
      return [1, 1, 1, 1]
    }
    return this.material.baseColor
  }

  get baseColorTexture() {
    if (!this.material || !this.material.baseColorTexture) {
      return PIXI.Texture.EMPTY
    }
    return this.material.baseColorTexture
  }

  get directionalLight() {
    let environment = LightingEnvironment.main
    if (!environment || !environment.directionalLight) {
      return [0, 0, 0]
    }
    environment.directionalLight.transform.updateLocalTransform()
    return environment.directionalLight.transform.localPosition
  }
}

class GeneratedStandardProgram extends PIXI.Program {
  constructor(attributes: StandardShaderAttribute[]) {
    let vert: string = require("./glsl/standard/standard.vert").default
    let frag: string = require("./glsl/standard/standard.frag").default

    if (attributes.indexOf(StandardShaderAttribute.normal) >= 0) {
      vert = vert.replace(/(NORMAL) 0/, "$1 1")
      frag = frag.replace(/(NORMAL) 0/, "$1 1")
    }
    if (attributes.indexOf(StandardShaderAttribute.texCoord) >= 0) {
      vert = vert.replace(/(TEXCOORD) 0/, "$1 1")
      frag = frag.replace(/(TEXCOORD) 0/, "$1 1")
    }
    super(vert, frag)
  }
}