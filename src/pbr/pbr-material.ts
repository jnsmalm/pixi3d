import * as PIXI from "pixi.js"

import { PhysicallyBasedShaderFeature } from "./pbr-feature"
import { PhysicallyBasedShader } from "./pbr-shader"
import { Material } from "../material"
import { MeshGeometryData } from "../mesh/mesh-geometry"
import { Camera3D } from "../camera"
import { glTFMaterial } from "../gltf/gltf-material"
import { LightingEnvironment } from "../lighting/lighting-environment"
import { Mesh3D } from "../mesh/mesh"

export enum PhysicallyBasedMaterialAlphaMode {
  opaque = "opaque",
  mask = "mask",
  blend = "blend"
}

const shaders: { [features: string]: PIXI.Shader } = {}

export class PhysicallyBasedMaterial extends Material {
  private _doubleSided = false
  private _valid = false
  private _lighting?: LightingEnvironment

  roughness = 1
  metallic = 1
  baseColorTexture?: PIXI.Texture
  metallicRoughnessTexture?: PIXI.Texture
  normalTexture?: PIXI.Texture
  occlusionTexture?: PIXI.Texture
  emissiveTexture?: PIXI.Texture
  baseColor = [1, 1, 1, 1]
  alphaMaskCutoff = 0.5
  alphaMode = PhysicallyBasedMaterialAlphaMode.opaque

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

  get doubleSided() {
    return this._doubleSided
  }

  set doubleSided(value: boolean) {
    if (value) {
      this.state.culling = false
    }
    this._doubleSided = value
  }

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
          material.transparent = true
          break
        }
        case "MASK": {
          material.alphaMode = PhysicallyBasedMaterialAlphaMode.mask
          material.transparent = true
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

  createGeometry(data: MeshGeometryData) {
    let geometry = new PIXI.Geometry()

    if (data.indices) {
      // PIXI seems to have problems using anything other than gl.UNSIGNED_SHORT 
      // or gl.UNSIGNED_INT. Let's convert buffer to UNSIGNED_INT.
      geometry.addIndex(new PIXI.Buffer(new Uint32Array(data.indices.buffer)))
    }
    if (data.positions) {
      let buffer = new PIXI.Buffer(data.positions.buffer)
      geometry.addAttribute("a_Position", buffer, 3, false, PIXI.TYPES.FLOAT, data.positions.stride)
    }
    if (data.normals) {
      let buffer = new PIXI.Buffer(data.normals.buffer)
      geometry.addAttribute("a_Normal", buffer, 3, false, PIXI.TYPES.FLOAT, data.normals.stride)
    }
    if (data.tangents) {
      let buffer = new PIXI.Buffer(data.tangents.buffer)
      geometry.addAttribute("a_Tangent", buffer, 4, false, PIXI.TYPES.FLOAT, data.tangents.stride)
    }
    if (data.texCoords) {
      let buffer = new PIXI.Buffer(data.texCoords.buffer)
      geometry.addAttribute("a_UV1", buffer, 2, false, PIXI.TYPES.FLOAT, data.texCoords.stride)
    }
    if (data.morphTargets) {
      for (let i = 0; i < data.morphTargets.length; i++) {
        let positions = data.morphTargets[i].positions
        if (positions) {
          let buffer = new PIXI.Buffer(positions.buffer)
          geometry.addAttribute(`a_Target_Position${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, positions.stride)
        }
        let normals = data.morphTargets[i].normals
        if (normals) {
          let buffer = new PIXI.Buffer(normals.buffer)
          geometry.addAttribute(`a_Target_Normal${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, normals.stride)
        }
        let tangents = data.morphTargets[i].tangents
        if (tangents) {
          let buffer = new PIXI.Buffer(tangents.buffer)
          geometry.addAttribute(`a_Target_Tangent${i}`, buffer, 3, false, PIXI.TYPES.FLOAT, tangents.stride)
        }
      }
    }
    return geometry
  }

  createShader(mesh: Mesh3D, renderer: any) {
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
      shaders[checksum] = PhysicallyBasedShader.build(renderer, features)
    }
    return shaders[checksum]
  }

  createFeatures(geometry: MeshGeometryData) {
    let features: string[] = []

    if (geometry.normals) {
      features.push(PhysicallyBasedShaderFeature.normal)
    }
    if (geometry.texCoords) {
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

    // features.push(PhysicallyBasedShaderFeature.materialUnlit)

    features.push(PhysicallyBasedShaderFeature.materialMetallicRoughness)
    features.push(PhysicallyBasedShaderFeature.texLod)

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
    switch (this.alphaMode) {
      case PhysicallyBasedMaterialAlphaMode.opaque: {
        features.push(PhysicallyBasedShaderFeature.alphaModeOpaque)
        break
      }
      case PhysicallyBasedMaterialAlphaMode.mask: {
        features.push(PhysicallyBasedShaderFeature.alphaModeMask)
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
    shader.uniforms.u_Exposure = 1

    if (this.alphaMode === PhysicallyBasedMaterialAlphaMode.mask) {
      shader.uniforms.u_AlphaCutoff = this.alphaMaskCutoff
    }

    if (mesh.weights) {
      shader.uniforms.u_morphWeights = mesh.weights
    }

    if (this.baseColorTexture) {
      shader.uniforms.u_BaseColorSampler = this.baseColorTexture
      shader.uniforms.u_BaseColorUVSet = 0
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

  render(mesh: Mesh3D, renderer: PIXI.Renderer) {
    if (!(this.doubleSided && this.transparent)) {
      super.render(mesh, renderer)
    } else {
      let { culling, clockwiseFrontFace } = this.state
      Object.assign(this.state, {
        culling: true, clockwiseFrontFace: true
      })
      super.render(mesh, renderer)
      Object.assign(this.state, {
        culling: true, clockwiseFrontFace: false
      })
      super.render(mesh, renderer)
      Object.assign(this.state, {
        culling: culling, clockwiseFrontFace: clockwiseFrontFace
      })
    }
  }
}