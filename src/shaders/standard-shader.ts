import { Shader } from "../shader"
import { Camera3D } from "../camera"
import { Transform3D } from "../transform"
import { LightingEnvironment } from "../light"
import { MeshGeometryData, Mesh3D } from "../mesh"
import { MetallicRoughnessMaterial, Material } from "../material"

export enum StandardShaderAttribute {
  normal = "normal",
  texCoord = "texCoord",
  tangent = "tangent",
  targetPosition0 = "targetPosition0",
  targetPosition1 = "targetPosition1",
  targetPosition2 = "targetPosition2",
  targetPosition3 = "targetPosition3",
  targetNormal0 = "targetNormal0",
  targetNormal1 = "targetNormal1",
  targetTangent0 = "targetTangent0",
  targetTangent1 = "targetTangent1",
}

export enum StandardShaderFeature {
  normalMap = "normalMapping",
  emissiveMap = "emissiveMap",
  ibl = "ibl",
  alphaModeOpaque = "alphaModeOpaque",
  alphaModeBlend = "alphaModeBlend",
  alphaModeMask = "alphaModeMask",
  morphing = "morphing"
}

export class StandardShader extends PIXI.Shader implements Shader {
  private transform: Transform3D | undefined
  private material: MetallicRoughnessMaterial | undefined
  private weights?: number[]

  constructor(attributes: string[] = [], private features: string[] = []) {
    super(StandardShaderProgram.build(attributes, features))
  }

  updateUniforms(mesh: Mesh3D) {
    this.material = mesh.material as MetallicRoughnessMaterial
    this.weights = mesh.weights
    this.transform = mesh.transform

    let lighting = LightingEnvironment.main
    if (this.features.includes(StandardShaderFeature.ibl)) {
      if (!lighting.irradianceTexture) {
        throw new Error("PIXI3D: Irradiance texture has not been set.")
      }
      this.uniforms.irradianceMap = lighting.irradianceTexture
      if (!lighting.radianceTexture) {
        throw new Error("PIXI3D: Radiance texture has not been set.")
      }
      this.uniforms.radianceMap = lighting.radianceTexture
      this.uniforms.brdfLUT = lighting.brdfLUT
      this.uniforms.radianceLevels = lighting.radianceTexture.resource.levels
    }
    if (this.transform) {
      this.uniforms.world = this.transform.worldTransform.array
    }
    this.uniforms.viewPosition = Camera3D.main.viewPosition
    this.uniforms.viewProjection = Camera3D.main.viewProjection
    this.uniforms.baseColor = this.baseColor
    this.uniforms.baseColorMap = this.baseColorMap
    this.uniforms.metallic = this.metallic
    this.uniforms.roughness = this.roughness
    this.uniforms.metallicRoughnessMap = this.metallicRoughnessMap
    this.uniforms.normalMap = this.normalMap
    this.uniforms.occlusionMap = this.occlusionMap
    this.uniforms.emissiveMap = this.emissiveMap
    this.uniforms.lightPositions = this.lightPositions
    this.uniforms.lightColors = this.lightColors
    this.uniforms.morphWeights = this.morphWeights
    this.uniforms.alphaMaskCutoff = this.alphaMaskCutoff
  }

  get alphaMaskCutoff() {
    if (!this.material) {
      return 0.5
    }
    return this.material.alphaMaskCutoff
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
      return 1
    }
    return this.material.metallic
  }

  get roughness() {
    if (!this.material || this.material.roughness === undefined) {
      return 1
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
    if (lightPositions.length === 0) {
      lightPositions = [0, 0, 0]
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
    if (lightColors.length === 0) {
      lightColors = [0, 0, 0]
    }
    return lightColors
  }

  get morphWeights() {
    if (!this.weights) {
      return [0]
    }
    return this.weights
  }

  createMaterial(material: Material) {
    return material
  }

  createGeometry(data: MeshGeometryData): PIXI.Geometry {
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
    if (data.morphTargets) {
      for (let i = 0; i < data.morphTargets.length; i++) {
        let positions = data.morphTargets[i].positions
        if (positions) {
          geometry.addAttribute(`targetPosition${i}`, positions.buffer, 3, false,
            PIXI.TYPES.FLOAT, positions.stride)
        }
        let normals = data.morphTargets[i].normals
        if (normals) {
          geometry.addAttribute(`targetNormal${i}`, normals.buffer, 3, false,
            PIXI.TYPES.FLOAT, normals.stride)
        }
        let tangents = data.morphTargets[i].tangents
        if (tangents) {
          geometry.addAttribute(`targetTangent${i}`, tangents.buffer, 3, false,
            PIXI.TYPES.FLOAT, tangents.stride)
        }
      }
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
  export function build(attributes: string[], features: string[]) {
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
    if (attributes.includes(StandardShaderAttribute.targetPosition0)) {
      defines.push("HAS_TARGET_POSITION0")
    }
    if (attributes.includes(StandardShaderAttribute.targetPosition1)) {
      defines.push("HAS_TARGET_POSITION1")
    }
    if (attributes.includes(StandardShaderAttribute.targetPosition2)) {
      defines.push("HAS_TARGET_POSITION2")
    }
    if (attributes.includes(StandardShaderAttribute.targetPosition3)) {
      defines.push("HAS_TARGET_POSITION3")
    }
    if (attributes.includes(StandardShaderAttribute.targetNormal0)) {
      defines.push("HAS_TARGET_NORMAL0")
    }
    if (attributes.includes(StandardShaderAttribute.targetNormal1)) {
      defines.push("HAS_TARGET_NORMAL1")
    }
    if (attributes.includes(StandardShaderAttribute.targetTangent0)) {
      defines.push("HAS_TARGET_TANGENT0")
    }
    if (attributes.includes(StandardShaderAttribute.targetTangent1)) {
      defines.push("HAS_TARGET_TANGENT1")
    }
    if (features.includes(StandardShaderFeature.emissiveMap)) {
      defines.push("EMISSIVE_MAP")
    }
    if (features.includes(StandardShaderFeature.ibl)) {
      defines.push("USE_IBL")
    }
    if (features.includes(StandardShaderFeature.morphing)) {
      defines.push("USE_MORPHING")
    }
    if (features.includes(StandardShaderFeature.alphaModeOpaque)) {
      defines.push("ALPHAMODE_OPAQUE")
    }
    if (features.includes(StandardShaderFeature.alphaModeMask)) {
      defines.push("ALPHAMODE_MASK")
    }
    if (features.includes(StandardShaderFeature.alphaModeBlend)) {
      defines.push("ALPHAMODE_BLEND")
    }
    return PIXI.Program.from(ProgramSource.build(vert, defines),
      ProgramSource.build(frag, defines))
  }
}