import * as PIXI from "pixi.js"

import { LightType } from "../../lighting/light-type"
import { StandardMaterialFeatureSet } from "./standard-material-feature-set"
import { StandardShader } from "./standard-shader"
import { Material } from "../material"
import { Camera } from "../../camera/camera"
import { glTFMaterial } from "../../gltf/gltf-material"
import { LightingEnvironment } from "../../lighting/lighting-environment"
import { Mesh3D } from "../../mesh/mesh"
import { StandardMaterialAlphaMode } from "./standard-material-alpha-mode"
import { StandardMaterialDebugMode } from "./standard-material-debug-mode"
import { ShadowCastingLight } from "../../shadow/shadow-casting-light"
import { StandardMaterialSkinUniforms } from "./standard-material-skin-uniforms"
import { MaterialRenderSortType } from "../material-render-sort-type"
import { Color } from "../../color"

const shaders: { [features: string]: StandardShader } = {}

/**
 * The standard material is using Physically-Based Rendering (PBR) which makes 
 * it suitable to represent a wide range of different surfaces. It's the default 
 * material when loading models from file.
 */
export class StandardMaterial extends Material {
  private _lightingEnvironment?: LightingEnvironment
  private _unlit = false
  private _alphaMode = StandardMaterialAlphaMode.opaque
  private _debugMode?: StandardMaterialDebugMode
  private _baseColorTexture?: PIXI.Texture
  private _baseColor = new Float32Array(4)
  private _normalTexture?: PIXI.Texture
  private _occlusionTexture?: PIXI.Texture
  private _emissiveTexture?: PIXI.Texture
  private _metallicRoughnessTexture?: PIXI.Texture
  private _shadowCastingLight?: ShadowCastingLight
  private _lightsCount?: number

  private _skinUniforms = new StandardMaterialSkinUniforms()

  /** The roughness of the material. */
  roughness = 1

  /** The metalness of the material. */
  metallic = 1

  /** The base color of the material. */
  baseColor = new Color(1, 1, 1, 1)

  /** The cutoff threshold when alpha mode is set to "mask". */
  alphaCutoff = 0.5

  /** The emissive color of the material. */
  emissive = new Color(0, 0, 0, 0)

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
        this.renderSortType = MaterialRenderSortType.opaque
      } else {
        this.renderSortType = MaterialRenderSortType.transparent
      }
      this.invalidateShader()
    }
  }

  /** The shadow casting light of the material. */
  get shadowCastingLight() {
    return this._shadowCastingLight
  }

  set shadowCastingLight(value: ShadowCastingLight | undefined) {
    if (value !== this._shadowCastingLight) {
      this.invalidateShader()
      this._shadowCastingLight = value
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

  /**
   * The camera used when rendering a mesh. If this value is not set, the main 
   * camera will be used by default.
   */
  camera?: Camera

  /**
   * Lighting environment used when rendering a mesh. If this value is not set, 
   * the main lighting environment will be used by default.
   */
  get lightingEnvironment() {
    return this._lightingEnvironment
  }

  set lightingEnvironment(value: LightingEnvironment | undefined) {
    if (value !== this._lightingEnvironment) {
      this.invalidateShader()
      this._lightingEnvironment = value
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

  destroy() {
    this._baseColorTexture?.destroy()
    this._normalTexture?.destroy()
    this._emissiveTexture?.destroy()
    this._occlusionTexture?.destroy()
    this._metallicRoughnessTexture?.destroy()
    this._skinUniforms.destroy()
  }

  /**
   * Invalidates the shader so it can be rebuilt with the current features.
   */
  invalidateShader() {
    this._shader = undefined
  }

  /**
   * Creates a standard material factory which can be used when loading models.
   * @param props Properties to set on the material when created.
   */
  static factory(props = {}) {
    return {
      create: (source: unknown) => {
        return <StandardMaterial>Object.assign(StandardMaterial.create(source), props)
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
      material.baseColor = Color.from(source.baseColor)
      material.baseColorTexture = source.baseColorTexture?.clone()
      material.metallic = source.metallic
      material.roughness = source.roughness
      material.metallicRoughnessTexture = source.metallicRoughnessTexture?.clone()
      switch (source.alphaMode) {
        case "BLEND": {
          material.alphaMode = StandardMaterialAlphaMode.blend
          break
        }
        case "MASK": {
          material.alphaMode = StandardMaterialAlphaMode.mask
          break
        }
        case "OPAQUE": {
          material.alphaMode = StandardMaterialAlphaMode.opaque
          break
        }
      }
      material.unlit = source.unlit
      material.emissiveTexture = source.emissiveTexture?.clone()
      material.emissive = Color.from(source.emissive)
      material.normalTexture = source.normalTexture?.clone()
      material.occlusionTexture = source.occlusionTexture?.clone()
      material.doubleSided = source.doubleSided
      material.alphaCutoff = source.alphaCutoff
      if (source.baseColorTexture && (<any>source.baseColorTexture).uvTransform) {
        (<any>material.baseColorTexture).uvTransform = (<any>source.baseColorTexture).uvTransform;
      }
      if (source.normalTexture && (<any>source.normalTexture).uvTransform) {
        (<any>material.normalTexture).uvTransform = (<any>source.normalTexture).uvTransform;
      }
      if (source.emissiveTexture && (<any>source.emissiveTexture).uvTransform) {
        (<any>material.emissiveTexture).uvTransform = (<any>source.emissiveTexture).uvTransform;
      }
      if (source.occlusionTexture && (<any>source.occlusionTexture).uvTransform) {
        (<any>material.occlusionTexture).uvTransform = (<any>source.occlusionTexture).uvTransform;
      }
      if (source.metallicRoughnessTexture && (<any>source.metallicRoughnessTexture).uvTransform) {
        (<any>material.metallicRoughnessTexture).uvTransform = (<any>source.metallicRoughnessTexture).uvTransform;
      }
    }
    return material
  }

  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    let lightingEnvironment = this.lightingEnvironment || LightingEnvironment.main
    if (lightingEnvironment.lights.length !== this._lightsCount) {
      // Invalidate shader when the number of punctual lights has changed.
      this.invalidateShader()
      this._lightsCount = lightingEnvironment.lights.length
    }
    super.render(mesh, renderer)
  }

  createShader(mesh: Mesh3D, renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 1) {
      let extensions = ["EXT_shader_texture_lod", "OES_standard_derivatives"]
      for (let ext of extensions) {
        if (!renderer.gl.getExtension(ext)) {
          console.warn(`PIXI3D: Extension "${ext}" is not supported by current platform, the material may not be displayed correctly.`)
        }
      }
    }
    let lightingEnvironment = this.lightingEnvironment || LightingEnvironment.main
    let features = StandardMaterialFeatureSet.build(renderer, mesh, mesh.geometry, this, lightingEnvironment)
    if (!features) {
      // The shader features couldn't be built, some resources may still be 
      // loading. Don't worry, we will retry creating shader at next render.
      return undefined
    }
    if (mesh.skin && StandardMaterialFeatureSet.hasSkinningTextureFeature(features)) {
      this._skinUniforms.enableJointMatrixTextures(mesh.skin.joints.length)
    }
    let checksum = features.join(",")
    if (!shaders[checksum]) {
      shaders[checksum] = StandardShader.build(renderer, features)
    }
    return shaders[checksum]
  }

  updateUniforms(mesh: Mesh3D, shader: PIXI.Shader) {
    this._baseColor.set(this.baseColor.rgb)
    this._baseColor[3] = this.baseColor.a * mesh.worldAlpha
    let camera = this.camera || Camera.main
    if (mesh.skin) {
      this._skinUniforms.update(mesh, shader)
    }
    shader.uniforms.u_Camera = camera.worldTransform.position
    shader.uniforms.u_ViewProjectionMatrix = camera.viewProjection
    shader.uniforms.u_Exposure = this.exposure
    shader.uniforms.u_MetallicFactor = this.metallic
    shader.uniforms.u_RoughnessFactor = this.roughness
    shader.uniforms.u_BaseColorFactor = this._baseColor
    shader.uniforms.u_EmissiveFactor = this.emissive.rgb
    shader.uniforms.u_ModelMatrix = mesh.worldTransform.toArray()
    shader.uniforms.u_NormalMatrix = mesh.transform.normalTransform.toArray()
    if (this._shadowCastingLight) {
      shader.uniforms.u_ShadowSampler = this._shadowCastingLight.shadowTexture
      shader.uniforms.u_LightViewProjectionMatrix = this._shadowCastingLight.lightViewProjection
    }
    if (this._alphaMode === StandardMaterialAlphaMode.mask) {
      shader.uniforms.u_AlphaCutoff = this.alphaCutoff
    }
    if (mesh.morphWeights) {
      shader.uniforms.u_morphWeights = mesh.morphWeights
    }
    if (this.baseColorTexture?.valid) {
      shader.uniforms.u_BaseColorSampler = this.baseColorTexture
      shader.uniforms.u_BaseColorUVSet = 0
      if ((<any>this.baseColorTexture).uvTransform) {
        shader.uniforms.u_BaseColorUVTransform = (<any>this.baseColorTexture).uvTransform;
      }
    }
    let lightingEnvironment = this.lightingEnvironment || LightingEnvironment.main
    for (let i = 0; i < lightingEnvironment.lights.length; i++) {
      let light = lightingEnvironment.lights[i]
      let type = 0
      switch (light.type) {
        case LightType.point: type = 1; break
        case LightType.directional: type = 0; break
        case LightType.spot: type = 2; break
        case LightType.ambient: type = 3; break
      }
      shader.uniforms[`u_Lights[${i}].type`] = type
      shader.uniforms[`u_Lights[${i}].position`] = light.worldTransform.position
      shader.uniforms[`u_Lights[${i}].direction`] = light.worldTransform.forward
      shader.uniforms[`u_Lights[${i}].range`] = light.range
      shader.uniforms[`u_Lights[${i}].color`] = light.color.rgb
      shader.uniforms[`u_Lights[${i}].intensity`] = light.intensity
      shader.uniforms[`u_Lights[${i}].innerConeCos`] = Math.cos(light.innerConeAngle * PIXI.DEG_TO_RAD)
      shader.uniforms[`u_Lights[${i}].outerConeCos`] = Math.cos(light.outerConeAngle * PIXI.DEG_TO_RAD)
    }
    let imageBasedLighting = lightingEnvironment.imageBasedLighting
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
      if ((<any>this.emissiveTexture).uvTransform) {
        shader.uniforms.u_EmissiveUVTransform = (<any>this.emissiveTexture).uvTransform;
      }
    }
    if (this.normalTexture?.valid) {
      shader.uniforms.u_NormalSampler = this.normalTexture
      shader.uniforms.u_NormalScale = 1
      shader.uniforms.u_NormalUVSet = 0
      if ((<any>this.normalTexture).uvTransform) {
        shader.uniforms.u_NormalUVTransform = (<any>this.normalTexture).uvTransform;
      }
    }
    if (this.metallicRoughnessTexture?.valid) {
      shader.uniforms.u_MetallicRoughnessSampler = this.metallicRoughnessTexture
      shader.uniforms.u_MetallicRoughnessUVSet = 0
      if ((<any>this.metallicRoughnessTexture).uvTransform) {
        shader.uniforms.u_MetallicRoughnessUVTransform = (<any>this.metallicRoughnessTexture).uvTransform;
      }
    }
    if (this.occlusionTexture?.valid) {
      shader.uniforms.u_OcclusionSampler = this.occlusionTexture
      shader.uniforms.u_OcclusionStrength = 1
      shader.uniforms.u_OcclusionUVSet = 0
      if ((<any>this.occlusionTexture).uvTransform) {
        shader.uniforms.u_OcclusionUVTransform = (<any>this.occlusionTexture).uvTransform;
      }
    }
  }
}