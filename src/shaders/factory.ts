import { MeshData } from "../mesh"
import { Shader } from "../shader"
import { MetallicRoughnessMaterial, MaterialAlphaMode } from "../material"
import { StandardShader, StandardShaderAttribute, StandardShaderFeature } from "./standard"
import { LightingEnvironment } from "../light"

export interface ShaderFactory {
  createShader(data: MeshData, material: MetallicRoughnessMaterial): Shader
}

export class DefaultShaderFactory implements ShaderFactory {
  createShader(data: MeshData, material: MetallicRoughnessMaterial): Shader {
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
    if (data.targets) {
      for (let i = 0; i < data.targets.length; i++) {
        if (data.targets[i].positions) {
          attributes.push(`targetPosition${i}`)
        }
        if (data.targets[i].normals) {
          attributes.push(`targetNormals${i}`)
        }
        if (data.targets[i].tangents) {
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
    if (data.targets) {
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