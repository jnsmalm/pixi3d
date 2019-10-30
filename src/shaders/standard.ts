import { Shader } from "../shader"
import { MetallicRoughnessMaterial } from "../material"
import { Camera3D } from "../camera"
import { MeshData } from "../mesh"
import { Transform3D } from "../transform"
import { LightingEnvironment } from "../light"

export enum StandardShaderAttribute {
  normal = "normal", texCoord = "texCoord", tangent = "tangent"
}

export enum StandardShaderFeature {
  normalMap = "normalMapping", emissiveMap = "emissiveMap"
}

export class StandardShader extends PIXI.Shader implements Shader {
  transform: Transform3D | undefined
  material: MetallicRoughnessMaterial | undefined

  constructor(attributes: StandardShaderAttribute[], features: StandardShaderFeature[]) {
    super(StandardShaderProgram.build(attributes, features))
  }

  update() {
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform
    }
    this.uniforms.viewProjection = Camera3D.main.viewProjection
    this.uniforms.baseColor = this.baseColor
    this.uniforms.baseColorMap = this.baseColorMap
    this.uniforms.metallic = this.metallic
    this.uniforms.roughness = this.roughness
    this.uniforms.metallicRoughnessMap = this.metallicRoughnessMap
    this.uniforms.normalMap = this.normalMap
    this.uniforms.occlusionMap = this.occlusionMap
    this.uniforms.emissiveMap = this.emissiveMap

    Camera3D.main.transform.updateLocalTransform()
    this.uniforms.viewPosition = Camera3D.main.transform.localPosition

    this.uniforms.lightPositions = this.lightPositions
    this.uniforms.lightColors = this.lightColors
  }

  get baseColor() {
    if (!this.material || !this.material.baseColor) {
      return [1, 1, 1, 1]
    }
    return this.material.baseColor
  }

  get baseColorMap() {
    if (!this.material || !this.material.baseColorTexture) {
      return PIXI.Texture.WHITE
    }
    return this.material.baseColorTexture
  }

  get metallic() {
    if (!this.material || this.material.metallic === undefined) {
      return 1;
    }
    return this.material.metallic
  }

  get roughness() {
    if (!this.material || this.material.roughness === undefined) {
      return 1;
    }
    return this.material.roughness
  }

  get metallicRoughnessMap() {
    if (!this.material || !this.material.metallicRoughnessTexture) {
      return PIXI.Texture.WHITE
    }
    return this.material.metallicRoughnessTexture
  }

  get occlusionMap() {
    if (!this.material || !this.material.occlusionTexture) {
      return PIXI.Texture.WHITE
    }
    return this.material.occlusionTexture
  }

  get emissiveMap() {
    if (!this.material || !this.material.emissiveTexture) {
      return PIXI.Texture.EMPTY
    }
    return this.material.emissiveTexture
  }

  get normalMap() {
    if (!this.material || !this.material.normalTexture) {
      return PIXI.Texture.WHITE
    }
    return this.material.normalTexture
  }

  get lightPositions() {
    let lighting = LightingEnvironment.main
    let lightPositions = []
    for (let i = 0; i < lighting.pointLights.length; i++) {
      for (let j = 0; j < 3; j++) {
        lightPositions.push(lighting.pointLights[i].worldPosition[j])
      }
    }
    return lightPositions
  }

  get lightColors() {
    let lighting = LightingEnvironment.main
    let lightColors = []
    for (let i = 0; i < lighting.pointLights.length; i++) {
      for (let j = 0; j < 3; j++) {
        lightColors.push(lighting.pointLights[i].color[j])
      }
    }
    return lightColors
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
    if (data.tangents) {
      geometry.addAttribute("tangent", data.tangents.buffer, 4, false,
        PIXI.TYPES.FLOAT, data.tangents.stride)
    }
    if (data.indices) {
      geometry.addIndex(new Uint16Array(data.indices.buffer))
    }
    return geometry
  }
}

namespace ProgramSource {
  const INSERT = /#define INSERT/
  const IMPORT = /#import <(.+)>/gm

  export function build(source: string, define: string[] = []) {
    let match: RegExpExecArray | null
    while ((match = IMPORT.exec(source)) !== null) {
      source = source.replace(match[0], require(`./glsl/${match[1]}`).default)
    }
    return source.replace(INSERT,
      define.map(value => `#define ${value}`).join("\n"))
  }
}

namespace StandardShaderProgram {
  export function build(attributes: StandardShaderAttribute[], features: StandardShaderFeature[]) {
    let vert: string = require("./glsl/primitives.vert").default
    let frag: string = require("./glsl/metallic-roughness.frag").default

    let defines = []
    if (attributes.includes(StandardShaderAttribute.normal)) {
      defines.push("HAS_NORMAL")
    }
    if (attributes.includes(StandardShaderAttribute.texCoord)) {
      defines.push("HAS_TEXCOORD_0")
    }
    if (attributes.includes(StandardShaderAttribute.tangent)) {
      if (features.includes(StandardShaderFeature.normalMap)) {
        defines.push("HAS_NORMAL_MAP")
      }
      defines.push("HAS_TANGENT")
    }
    if (features.includes(StandardShaderFeature.emissiveMap)) {
      defines.push("EMISSIVE_MAP")
    }
    return PIXI.Program.from(ProgramSource.build(vert, defines),
      ProgramSource.build(frag, defines))
  }
}