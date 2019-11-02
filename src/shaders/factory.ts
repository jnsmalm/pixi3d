import { MeshData } from "../mesh"
import { Shader } from "../shader"
import { MetallicRoughnessMaterial } from "../material"
import { StandardShader, StandardShaderAttribute, StandardShaderFeature } from "./standard"
import { LightingEnvironment } from "../light"

export interface ShaderFactory {
  createShader(data: MeshData, material: MetallicRoughnessMaterial): Shader
}

export class DefaultShaderFactory implements ShaderFactory {
  createShader(data: MeshData, material: MetallicRoughnessMaterial): Shader {
    let attributes: StandardShaderAttribute[] = []
    if (data.normals) {
      attributes.push(StandardShaderAttribute.normal)
    }
    if (data.texCoords) {
      attributes.push(StandardShaderAttribute.texCoord)
    }
    if (data.tangents) {
      attributes.push(StandardShaderAttribute.tangent)
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
    return new StandardShader(attributes, features)
  }
}