import { mat4 } from "gl-matrix"
import { Shader, ShaderFactory } from "../shader"
import { MetallicRoughnessMaterial } from "../material"
import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { Transform3D } from "../transform"
import { LightingEnvironment } from "../light"
import { Matrix } from "../matrix"

export enum StandardShaderAttribute {
  normal = "normal", texCoord = "texCoord", color = "color"
}

export class StandardShaderFactory implements ShaderFactory {
  createShader(data: MeshData): Shader {
    let attributes: StandardShaderAttribute[] = []
    if (data.normals) {
      attributes.push(StandardShaderAttribute.normal)
    }
    if (data.texCoords) {
      attributes.push(StandardShaderAttribute.texCoord)
    }
    if (data.colors) {
      attributes.push(StandardShaderAttribute.color)
    }
    return new StandardShader(attributes)
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
      geometry.addAttribute("position", data.positions.buffer, 3, false,
        PIXI.TYPES.FLOAT, data.positions.stride)
    }
    if (data.normals) {
      geometry.addAttribute("normal", data.normals.buffer, 3, false,
        PIXI.TYPES.FLOAT, data.normals.stride)
    }
    if (data.texCoords) {
      geometry.addAttribute("texCoord", data.texCoords.buffer, 2, false,
        PIXI.TYPES.FLOAT, data.texCoords.stride)
    }
    if (data.colors) {
      geometry.addAttribute("color", data.colors.buffer, 4, false,
        PIXI.TYPES.FLOAT, data.colors.stride)
    }
    if (data.indices) {
      geometry.addIndex(new Uint16Array(data.indices.buffer))
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
      return PIXI.Texture.WHITE
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
    if (attributes.indexOf(StandardShaderAttribute.color) >= 0) {
      vert = vert.replace(/(COLOR) 0/, "$1 1")
      frag = frag.replace(/(COLOR) 0/, "$1 1")
    }
    if (attributes.indexOf(StandardShaderAttribute.texCoord) >= 0) {
      vert = vert.replace(/(TEXCOORD) 0/, "$1 1")
      frag = frag.replace(/(TEXCOORD) 0/, "$1 1")
    }
    super(vert, frag)
  }
}