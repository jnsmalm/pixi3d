import * as PIXI from "pixi.js"

import { LightType } from "../../lighting/light-type"
import { StandardMaterialFeatureSet } from "./standard-material-feature-set"
import { StandardShader } from "./standard-shader"
import { Material } from "../material"
import { Camera3D } from "../../camera/camera"
import { glTFMaterial } from "../../gltf/gltf-material"
import { LightingEnvironment } from "../../lighting/lighting-environment"
import { Mesh3D } from "../../mesh/mesh"
import { StandardMaterialAlphaMode } from "./standard-material-alpha-mode"
import { StandardMaterialDebugMode } from "./standard-material-debug-mode"

const shaders: { [features: string]: StandardShader } = {}

/**
 * The standard material is using Physically-Based Rendering (PBR) which makes 
 * it suitable to represent a wide range of different surfaces. It's the default 
 * material when loading models from file.
 */
export class StandardMaterial extends Material {
  private _lighting?: LightingEnvironment
  private _unlit = false
  private _alphaMode = StandardMaterialAlphaMode.opaque
  private _debugMode?: StandardMaterialDebugMode
  private _baseColorTexture?: PIXI.Texture
  private _normalTexture?: PIXI.Texture
  private _occlusionTexture?: PIXI.Texture
  private _emissiveTexture?: PIXI.Texture
  private _metallicRoughnessTexture?: PIXI.Texture
  private _transparent = false

  /** The roughness of the material. */
  roughness = 1

  /** The metalness of the material. */
  metallic = 1

  /** The base color of the material. Array containing RGBA values. */
  baseColor = [1, 1, 1, 1]

  /** The cutoff threshold when alpha mode is set to "mask". */
  alphaCutoff = 0.5

  /** The emissive color of the material. Array containing RGB values. */
  emissive = [0, 0, 0]

  /** The exposure (brightness) of the material. */
  exposure = 3

  /** The base color texture. */
  get baseColorTexture() {
    return this._baseColorTexture
  }

  set baseColorTexture(value: PIXI.Texture | undefined) {
    if (value !== this._baseColorTexture) {
      this.invalidateShader()
      this._baseColorTexture = value
    }
  }

  /** The metallic-roughness texture. */
  get metallicRoughnessTexture() {
    return this._metallicRoughnessTexture
  }

  set metallicRoughnessTexture(value: PIXI.Texture | undefined) {
    if (value !== this._metallicRoughnessTexture) {
      this.invalidateShader()
      this._metallicRoughnessTexture = value
    }
  }

  /** The normal map texture. */
  get normalTexture() {
    return this._normalTexture
  }

  set normalTexture(value: PIXI.Texture | undefined) {
    if (value !== this._normalTexture) {
      this.invalidateShader()
      this._normalTexture = value
    }
  }

  /** The occlusion map texture. */
  get occlusionTexture() {
    return this._occlusionTexture
  }

  set occlusionTexture(value: PIXI.Texture | undefined) {
    if (value !== this._occlusionTexture) {
      this.invalidateShader()
      this._occlusionTexture = value
    }
  }

  /** The emissive map texture. */
  get emissiveTexture() {
    return this._emissiveTexture
  }

  set emissiveTexture(value: PIXI.Texture | undefined) {
    if (value !== this._emissiveTexture) {
      this.invalidateShader()
      this._emissiveTexture = value
    }
  }

  /** The alpha rendering mode of the material. */
  get alphaMode() {
    return this._alphaMode
  }

  set alphaMode(value: StandardMaterialAlphaMode) {
    if (this._alphaMode !== value) {
      this._alphaMode = value
      if (this._alphaMode === StandardMaterialAlphaMode.opaque) {
        this._transparent = false
      } else {
        this._transparent = true
      }
      this.invalidateShader()
    }
  }

  /** The debug rendering mode of the material. */
  get debugMode() {
    return this._debugMode
  }

  set debugMode(value: StandardMaterialDebugMode | undefined) {
    if (this._debugMode !== value) {
      this.invalidateShader()
      this._debugMode = value
    }
  }

  get transparent() {
    return this._transparent
  }

  set transparent(value: boolean) {
    if (value !== this._transparent) {
      this.alphaMode = value ? StandardMaterialAlphaMode.blend : StandardMaterialAlphaMode.opaque
    }
    this._transparent = value
  }

  /**
   * The camera used when rendering a mesh. If this value is not set, the main 
   * camera will be used by default.
   */
  camera?: Camera3D

  /**
   * Lighting environment used when rendering a mesh. If this value is not set, 
   * the main lighting environment will be used by default.
   */
  get lighting() {
    return this._lighting
  }

  set lighting(value: LightingEnvironment | undefined) {
    if (value !== this._lighting) {
      this.invalidateShader()
      this._lighting = value
    }
  }

  /**
   * Value indicating if the material is unlit. If this value if set to true, 
   * all lighting is disabled and only the base color will be used.
   */
  get unlit() {
    return this._unlit
  }

  set unlit(value: boolean) {
    if (this._unlit !== value) {
      this._unlit = value
      this.invalidateShader()
    }
  }

  /**
   * Invalidates the shader so it can be rebuilt with the current features.
   */
  invalidateShader() {
    this._shader = undefined
  }

  /**
   * Creates a standard material factory which can be used when loading models.
   * @param properties Properties to set on the material when created.
   */
  static factory(properties = {}) {
    return {
      create: (source: unknown) => {
        return <StandardMaterial>Object.assign(StandardMaterial.create(source), properties)
      }
    }
  }

  /**
   * Creates a new standard material from the specified source.
   * @param source Source from which the material is created.
   */
  static create(source: unknown) {
    let material = new StandardMaterial()
    if (source instanceof glTFMaterial) {
      material.baseColor = source.baseColor
      material.baseColorTexture = source.baseColorTexture
      material.metallic = source.metallic
      material.roughness = source.roughness
      material.metallicRoughnessTexture = source.metallicRoughnessTexture
      switch (source.alphaMode) {
        case "BLEND": {
          material.alphaMode = StandardMaterialAlphaMode.blend
          break
        }
        case "MASK": {
          material.alphaMode = StandardMaterialAlphaMode.mask
          break
        }
      }
      material.unlit = source.unlit
      material.emissiveTexture = source.emissiveTexture
      material.emissive = source.emissive
      material.normalTexture = source.normalTexture
      material.occlusionTexture = source.occlusionTexture
      material.doubleSided = source.doubleSided
      material.alphaCutoff = source.alphaCutoff
    }
    return material
  }

  createShader(mesh: Mesh3D, renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 1) {
      let extensions = ["EXT_shader_texture_lod", "OES_standard_derivatives"]
      for (let ext of extensions) {
        if (!renderer.gl.getExtension(ext)) {
          console.warn(`PIXI3D: Extension "${ext}" is not supported.`)
        }
      }
    }
    let lighting = this.lighting || LightingEnvironment.main
    let features = StandardMaterialFeatureSet.build(mesh, mesh.geometry, this, lighting)
    if (!features) {
      // The shader features couldn't be built, some resources may still be 
      // loading. Don't worry, we will retry creating shader at next render.
      return undefined
    }
    let checksum = features.join(",")
    if (!shaders[checksum]) {
      shaders[checksum] = StandardShader.build(renderer, features)
    }
    return shaders[checksum]
  }

  updateUniforms(mesh: Mesh3D, shader: PIXI.Shader) {
    let camera = this.camera || Camera3D.main

    shader.uniforms.u_Camera = camera.worldTransform.position
    shader.uniforms.u_ViewProjectionMatrix = camera.viewProjection
    shader.uniforms.u_Exposure = this.exposure
    shader.uniforms.u_MetallicFactor = this.metallic
    shader.uniforms.u_RoughnessFactor = this.roughness
    shader.uniforms.u_BaseColorFactor = this.baseColor
    shader.uniforms.u_EmissiveFactor = this.emissive
    shader.uniforms.u_ModelMatrix = mesh.worldTransform.toArray()
    shader.uniforms.u_NormalMatrix = mesh.worldTransform.toArray()

    if (this._alphaMode === StandardMaterialAlphaMode.mask) {
      shader.uniforms.u_AlphaCutoff = this.alphaCutoff
    }
    if (mesh.morphWeights) {
      shader.uniforms.u_morphWeights = mesh.morphWeights
    }
    if (this.baseColorTexture?.valid) {
      shader.uniforms.u_BaseColorSampler = this.baseColorTexture
      shader.uniforms.u_BaseColorUVSet = 0
    }
    let lighting = this.lighting || LightingEnvironment.main
    for (let i = 0; i < lighting.lights.length; i++) {
      let light = lighting.lights[i]
      let type = 0
      switch (light.type) {
        case LightType.point: type = 1; break
        case LightType.directional: type = 0; break
        case LightType.spot: type = 2; break
      }
      shader.uniforms[`u_Lights[${i}].type`] = type
      shader.uniforms[`u_Lights[${i}].position`] = light.worldTransform.position
      shader.uniforms[`u_Lights[${i}].direction`] = light.direction
      shader.uniforms[`u_Lights[${i}].range`] = light.range
      shader.uniforms[`u_Lights[${i}].color`] = light.color
      shader.uniforms[`u_Lights[${i}].intensity`] = light.intensity
      shader.uniforms[`u_Lights[${i}].innerConeCos`] = Math.cos(light.innerConeAngle)
      shader.uniforms[`u_Lights[${i}].outerConeCos`] = Math.cos(light.outerConeAngle)
    }
    let imageBasedLighting = lighting.imageBasedLighting
    if (imageBasedLighting?.valid) {
      shader.uniforms.u_DiffuseEnvSampler = imageBasedLighting.diffuse
      shader.uniforms.u_SpecularEnvSampler = imageBasedLighting.specular
      shader.uniforms.u_brdfLUT = imageBasedLighting.brdf
      shader.uniforms.u_MipCount = imageBasedLighting.specular.levels - 1
    }
    if (this.emissiveTexture?.valid) {
      shader.uniforms.u_EmissiveSampler = this.emissiveTexture
      shader.uniforms.u_EmissiveUVSet = 0
      shader.uniforms.u_EmissiveFactor = [1, 1, 1]
    }
    if (this.normalTexture?.valid) {
      shader.uniforms.u_NormalSampler = this.normalTexture
      shader.uniforms.u_NormalScale = 1
      shader.uniforms.u_NormalUVSet = 0
    }
    if (this.metallicRoughnessTexture?.valid) {
      shader.uniforms.u_MetallicRoughnessSampler = this.metallicRoughnessTexture
      shader.uniforms.u_MetallicRoughnessUVSet = 0
    }
    if (this.occlusionTexture?.valid) {
      shader.uniforms.u_OcclusionSampler = this.occlusionTexture
      shader.uniforms.u_OcclusionStrength = 1
      shader.uniforms.u_OcclusionUVSet = 0
    }
  }
}