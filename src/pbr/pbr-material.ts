import * as PIXI from "pixi.js"

import { LightType } from "../lighting/light-type"
import { PhysicallyBasedShaderFeature } from "./pbr-feature"
import { PhysicallyBasedMeshShader } from "./pbr-shader"
import { Material } from "../material"
import { Camera3D } from "../camera/camera"
import { glTFMaterial } from "../gltf/gltf-material"
import { LightingEnvironment } from "../lighting/lighting-environment"
import { Mesh3D } from "../mesh/mesh"
import { MeshGeometry } from "../mesh/mesh-geometry"

export enum PhysicallyBasedMaterialAlphaMode {
  opaque = "opaque",
  mask = "mask",
  blend = "blend"
}

export enum PhysicallyBasedMaterialDebugMode {
  alpha = "alpha",
  emissive = "emissive",
  f0 = "f0",
  metallic = "metallic",
  normal = "normal",
  occlusion = "occlusion",
  roughness = "roughness"
}

const shaders: { [features: string]: PhysicallyBasedMeshShader } = {}

export class PhysicallyBasedMaterial extends Material {
  private _valid = false
  private _lighting?: LightingEnvironment
  private _unlit = false
  private _alphaMode = PhysicallyBasedMaterialAlphaMode.opaque
  private _debugMode?: PhysicallyBasedMaterialDebugMode

  roughness = 1
  metallic = 1
  baseColorTexture?: PIXI.Texture
  metallicRoughnessTexture?: PIXI.Texture
  normalTexture?: PIXI.Texture
  occlusionTexture?: PIXI.Texture
  emissiveTexture?: PIXI.Texture
  baseColor = [1, 1, 1, 1]
  alphaMaskCutoff = 0.5
  exposure = 1
  

  get alphaMode() {
    return this._alphaMode
  }

  set alphaMode(value: PhysicallyBasedMaterialAlphaMode) {
    if (this._alphaMode !== value) {
      this._alphaMode = value
      if (this._alphaMode === PhysicallyBasedMaterialAlphaMode.opaque) {
        this.transparent = false
      } else {
        this.transparent = true
      }
      // Clear the shader so it can be recreated with the new feature.
      this._shader = undefined
    }
  }

  get debugMode() {
    return this._debugMode
  }

  set debugMode(value: PhysicallyBasedMaterialDebugMode | undefined) {
    if (this._debugMode !== value) {
      this._debugMode = value
      // Clear the shader so it can be recreated with the new feature.
      this._shader = undefined
    }
  }

  get lighting() {
    if (!this._lighting) {
      return LightingEnvironment.main
    }
    return this._lighting
  }

  get valid() {
    if (this._valid) {
      return true
    }
    if (this.lighting && this.lighting.ibl && !this.lighting.ibl.valid) {
      return false
    }
    let textures = [
      this.baseColorTexture,
      this.metallicRoughnessTexture,
      this.normalTexture,
      this.occlusionTexture,
      this.emissiveTexture
    ]
    if (textures.some((value) => value && !value.valid)) {
      return false
    }
    return this._valid = true
  }

  get unlit() {
    return this._unlit
  }

  set unlit(value: boolean) {
    if (this._unlit !== value) {
      this._unlit = value
      // Clear the shader so it can be recreated with the new feature.
      this._shader = undefined
    }
  }

  /**
   * Creates a physically based material factory.
   * @param properties Properties to set on the material when created.
   */
  static factory(properties = {}) {
    return {
      create: (source: unknown) => {
        return <PhysicallyBasedMaterial>Object.assign(PhysicallyBasedMaterial.create(source), properties)
      }
    }
  }

  /**
   * Creates a new physically based material from the specified source.
   * @param source Source from which the material is created.
   */
  static create(source: unknown) {
    let material = new PhysicallyBasedMaterial()
    if (source instanceof glTFMaterial) {
      material.baseColor = source.baseColor
      material.baseColorTexture = source.baseColorTexture
      material.metallic = source.metallic
      material.roughness = source.roughness
      material.metallicRoughnessTexture = source.metallicRoughnessTexture
      switch (source.alphaMode) {
        case "BLEND": {
          material.alphaMode = PhysicallyBasedMaterialAlphaMode.blend
          break
        }
        case "MASK": {
          material.alphaMode = PhysicallyBasedMaterialAlphaMode.mask
          break
        }
      }
      material.emissiveTexture = source.emissiveTexture
      material.normalTexture = source.normalTexture
      material.occlusionTexture = source.occlusionTexture
      material.doubleSided = source.doubleSided
      material.alphaMaskCutoff = source.alphaMaskCutoff
    }
    return material
  }

  createShader(mesh: Mesh3D, renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 1) {
      let extensions = [
        "EXT_shader_texture_lod",
        "OES_standard_derivatives"
      ]
      for (let ext of extensions) {
        if (!renderer.gl.getExtension(ext)) {
          console.warn(`PIXI3D: Extension "${ext}" not supported.`)
        }
      }
    }
    let features = this.createFeatures(mesh.geometry)
    let checksum = features.join(",")
    if (!shaders[checksum]) {
      shaders[checksum] = PhysicallyBasedMeshShader.build(renderer, features)
    }
    return shaders[checksum]
  }

  createFeatures(geometry: MeshGeometry) {
    let features: string[] = []

    if (geometry.normals) {
      features.push(PhysicallyBasedShaderFeature.normal)
    }
    if (geometry.uvs) {
      features.push(PhysicallyBasedShaderFeature.texCoord0)
    }
    if (geometry.tangents) {
      features.push(PhysicallyBasedShaderFeature.tangent)
    }
    if (geometry.morphTargets) {
      for (let i = 0; i < geometry.morphTargets.length; i++) {
        if (geometry.morphTargets[i].positions) {
          features.push(PhysicallyBasedShaderFeature.targetPosition + i)
        }
        if (geometry.morphTargets[i].normals) {
          features.push(PhysicallyBasedShaderFeature.targetNormal + i)
        }
        if (geometry.morphTargets[i].tangents) {
          features.push(PhysicallyBasedShaderFeature.targetTangent + i)
        }
      }
      if (geometry.weights) {
        features.push(PhysicallyBasedShaderFeature.weightCount + " " + geometry.weights.length)
      }
      features.push(PhysicallyBasedShaderFeature.morphing)
    }
    if (this.baseColorTexture) {
      features.push(PhysicallyBasedShaderFeature.baseColorMap)
    }
    if (this._unlit) {
      features.push(PhysicallyBasedShaderFeature.materialUnlit)
    }
    features.push(PhysicallyBasedShaderFeature.materialMetallicRoughness)
    features.push(PhysicallyBasedShaderFeature.texLod)

    if (this.lighting.lights.length > 0) {
      features.push(PhysicallyBasedShaderFeature.lightCount.replace("{0}", this.lighting.lights.length.toString()))
      features.push(PhysicallyBasedShaderFeature.punctual)
    }

    if (this.lighting.ibl) {
      features.push(PhysicallyBasedShaderFeature.ibl)
    }
    if (this.emissiveTexture) {
      features.push(PhysicallyBasedShaderFeature.emissiveMap)
    }
    if (this.normalTexture) {
      features.push(PhysicallyBasedShaderFeature.normalMap)
    }
    if (this.metallicRoughnessTexture) {
      features.push(PhysicallyBasedShaderFeature.metallicRoughnessMap)
    }
    if (this.occlusionTexture) {
      features.push(PhysicallyBasedShaderFeature.occlusionMap)
    }
    switch (this._alphaMode) {
      case PhysicallyBasedMaterialAlphaMode.opaque: {
        features.push(PhysicallyBasedShaderFeature.alphaModeOpaque)
        break
      }
      case PhysicallyBasedMaterialAlphaMode.mask: {
        features.push(PhysicallyBasedShaderFeature.alphaModeMask)
        break
      }
    }
    if (this._debugMode) {
      features.push(PhysicallyBasedShaderFeature.debugOutput)
    }
    switch (this._debugMode) {
      case PhysicallyBasedMaterialDebugMode.alpha: {
        features.push(PhysicallyBasedShaderFeature.debugAlpha)
        break
      }
      case PhysicallyBasedMaterialDebugMode.emissive: {
        features.push(PhysicallyBasedShaderFeature.debugEmissive)
        break
      }
      case PhysicallyBasedMaterialDebugMode.f0: {
        features.push(PhysicallyBasedShaderFeature.debugF0)
        break
      }
      case PhysicallyBasedMaterialDebugMode.metallic: {
        features.push(PhysicallyBasedShaderFeature.debugMetallic)
        break
      }
      case PhysicallyBasedMaterialDebugMode.normal: {
        features.push(PhysicallyBasedShaderFeature.debugNormal)
        break
      }
      case PhysicallyBasedMaterialDebugMode.occlusion: {
        features.push(PhysicallyBasedShaderFeature.debugOcclusion)
        break
      }
      case PhysicallyBasedMaterialDebugMode.roughness: {
        features.push(PhysicallyBasedShaderFeature.debugRoughness)
        break
      }
    }
    return features
  }

  updateUniforms(mesh: Mesh3D, shader: PIXI.Shader) {
    shader.uniforms.u_ModelMatrix = mesh.transform.worldTransform.toArray()
    shader.uniforms.u_ViewProjectionMatrix = Camera3D.main.viewProjection
    shader.uniforms.u_NormalMatrix = mesh.transform.worldTransform.toArray()
    shader.uniforms.u_Camera = Camera3D.main.viewPosition

    shader.uniforms.u_MetallicFactor = this.metallic
    shader.uniforms.u_RoughnessFactor = this.roughness
    shader.uniforms.u_BaseColorFactor = this.baseColor
    shader.uniforms.u_Exposure = this.exposure

    if (this._alphaMode === PhysicallyBasedMaterialAlphaMode.mask) {
      shader.uniforms.u_AlphaCutoff = this.alphaMaskCutoff
    }

    if (mesh.geometry.weights) {
      shader.uniforms.u_morphWeights = mesh.geometry.weights
    }

    if (this.baseColorTexture) {
      shader.uniforms.u_BaseColorSampler = this.baseColorTexture
      shader.uniforms.u_BaseColorUVSet = 0
    }

    for (let i = 0; i < this.lighting.lights.length; i++) {
      let light = this.lighting.lights[i]

      let type = 0
      switch (light.type) {
        case LightType.point: type = 1; break
        case LightType.directional: type = 0; break
        case LightType.spot: type = 2; break
      }

      shader.uniforms[`u_Lights[${i}].type`] = type
      shader.uniforms[`u_Lights[${i}].position`] = light.worldPosition
      shader.uniforms[`u_Lights[${i}].direction`] = light.direction
      shader.uniforms[`u_Lights[${i}].range`] = light.range
      shader.uniforms[`u_Lights[${i}].color`] = light.color
      shader.uniforms[`u_Lights[${i}].intensity`] = light.intensity
      shader.uniforms[`u_Lights[${i}].innerConeCos`] = Math.cos(light.innerConeAngle)
      shader.uniforms[`u_Lights[${i}].outerConeCos`] = Math.cos(light.outerConeAngle)
      shader.uniforms[`u_Lights[${i}].padding`] = light.padding
    }

    if (this.lighting.ibl) {
      shader.uniforms.u_DiffuseEnvSampler = this.lighting.ibl.diffuse
      shader.uniforms.u_SpecularEnvSampler = this.lighting.ibl.specular
      shader.uniforms.u_brdfLUT = this.lighting.ibl.brdf
      shader.uniforms.u_MipCount = this.lighting.ibl.specular.levels - 1
    }

    if (this.emissiveTexture) {
      shader.uniforms.u_EmissiveSampler = this.emissiveTexture
      shader.uniforms.u_EmissiveUVSet = 0
      shader.uniforms.u_EmissiveFactor = [1, 1, 1]
    }

    if (this.normalTexture) {
      shader.uniforms.u_NormalSampler = this.normalTexture
      shader.uniforms.u_NormalScale = 1
      shader.uniforms.u_NormalUVSet = 0
    }

    if (this.metallicRoughnessTexture) {
      shader.uniforms.u_MetallicRoughnessSampler = this.metallicRoughnessTexture
      shader.uniforms.u_MetallicRoughnessUVSet = 0
    }

    if (this.occlusionTexture) {
      shader.uniforms.u_OcclusionSampler = this.occlusionTexture
      shader.uniforms.u_OcclusionStrength = 1
      shader.uniforms.u_OcclusionUVSet = 0
    }
  }
}