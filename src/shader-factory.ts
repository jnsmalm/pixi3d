import { Shader } from "./shader"
import { MetallicRoughnessMaterial, MaterialAlphaMode, Material } from "./material"
import { StandardShader, StandardShaderAttribute, StandardShaderFeature } from "./shaders/standard-shader"
import { LightingEnvironment } from "./light"
import { MeshGeometryData } from "./mesh"

export interface ShaderFactory {
  createShader(data: MeshGeometryData, material: Material): Shader
}

export class DefaultShaderFactory implements ShaderFactory {
  createShader(data: MeshGeometryData, material: MetallicRoughnessMaterial): Shader {
    let attributes: string[] = []
    if (data.normals) {
      attributes.push(StandardShaderAttribute.normal)
    }
    if (data.texCoords) {
      attributes.push(StandardShaderAttribute.texCoord)
    }
    if (data.tangents) {
      attributes.push(StandardShaderAttribute.tangent)
    }
    if (data.morphTargets) {
      for (let i = 0; i < data.morphTargets.length; i++) {
        if (data.morphTargets[i].positions) {
          attributes.push(`targetPosition${i}`)
        }
        if (data.morphTargets[i].normals) {
          attributes.push(`targetNormals${i}`)
        }
        if (data.morphTargets[i].tangents) {
          attributes.push(`targetTangents${i}`)
        }
      }
    }
    let features: StandardShaderFeature[] = []
    if (material.normalTexture) {
      features.push(StandardShaderFeature.normalMap)
    }
    if (material.emissiveTexture) {
      features.push(StandardShaderFeature.emissiveMap)
    }
    if (LightingEnvironment.main.irradianceTexture) {
      features.push(StandardShaderFeature.diffuseIrradiance)
    }
    if (data.morphTargets) {
      features.push(StandardShaderFeature.morphing)
    }
    if (material.alphaMode === MaterialAlphaMode.opaque) {
      features.push(StandardShaderFeature.alphaModeOpaque)
    }
    if (material.alphaMode === MaterialAlphaMode.mask) {
      features.push(StandardShaderFeature.alphaModeMask)
    }
    if (material.alphaMode === MaterialAlphaMode.blend) {
      features.push(StandardShaderFeature.alphaModeBlend)
    }
    return new StandardShader(attributes, features)
  }
}