import * as PIXI from "pixi.js"

import { MeshGeometry3D } from "../../mesh/geometry/mesh-geometry"
import { StandardMaterialAlphaMode } from "./standard-material-alpha-mode"
import { StandardMaterialDebugMode } from "./standard-material-debug-mode"
import { StandardMaterial } from "./standard-material"
import { LightingEnvironment } from "../../lighting/lighting-environment"
import { Mesh3D } from "../../mesh/mesh"
import { Platform } from "../../platform"
import { StandardMaterialMatrixTexture } from "./standard-material-matrix-texture"
import { Console } from "../../console"

export namespace StandardMaterialFeatureSet {
  export function build(renderer: PIXI.Renderer, mesh: Mesh3D, geometry: MeshGeometry3D, material: StandardMaterial, lightingEnvironment: LightingEnvironment) {
    let features: string[] = []

    if (mesh.instances.length > 0) {
      features.push("USE_INSTANCING 1")
    }
    if (geometry.normals) {
      features.push("HAS_NORMALS 1")
    }
    if (geometry.uvs) {
      features.push("HAS_UV_SET1 1")
    }
    if (geometry.tangents) {
      features.push("HAS_TANGENTS 1")
    }
    if (geometry.targets) {
      for (let i = 0; i < geometry.targets.length; i++) {
        if (geometry.targets[i].positions) {
          features.push("HAS_TARGET_POSITION" + i)
        }
        if (geometry.targets[i].normals) {
          features.push("HAS_TARGET_NORMAL" + i)
        }
        if (geometry.targets[i].tangents) {
          features.push("HAS_TARGET_TANGENT" + i)
        }
      }
      if (mesh.morphWeights) {
        features.push(`WEIGHT_COUNT ${mesh.morphWeights.length}`)
        features.push("USE_MORPHING 1")
      }
    }
    if (geometry.joints) {
      features.push("HAS_JOINT_SET1 1")
    }
    if (geometry.weights) {
      features.push("HAS_WEIGHT_SET1 1")
    }
    if (mesh.skin) {
      if (isJointMatrixTextureRequired(mesh.skin.joints.length, renderer)) {
        if (StandardMaterialMatrixTexture.isSupported(renderer)) {
          features.push("USE_SKINNING 1")
          features.push("USE_SKINNING_TEXTURE 1")
        } else {
          Console.error(`PIXI3D: Mesh contains ${mesh.skin.joints.length} joints, which is more than supported on this device. Skinning will be disabled and result may not be as expected.`)
        }
      } else {
        features.push("USE_SKINNING 1")
      }
      features.push(`JOINT_COUNT ${mesh.skin.joints.length}`)
    }
    if (material.unlit) {
      features.push("MATERIAL_UNLIT 1")
    }
    features.push("MATERIAL_METALLICROUGHNESS 1")
    if (lightingEnvironment.lights.length > 0) {
      features.push(`LIGHT_COUNT ${lightingEnvironment.lights.length}`)
      features.push("USE_PUNCTUAL 1")
    }
    if (lightingEnvironment.imageBasedLighting) {
      if (!lightingEnvironment.imageBasedLighting.valid) {
        return undefined
      }
      if (Platform.isShaderTextureLodSupported(renderer)) {
        features.push("USE_TEX_LOD 1")
      }
      features.push("USE_IBL 1")
    }
    if (material.shadowCastingLight) {
      features.push("USE_SHADOW_MAPPING 1")
    }
    if (material.baseColorTexture) {
      if (!material.baseColorTexture.valid) {
        return undefined
      }
	    if ((<any>material.baseColorTexture).uvTransform) {
		    features.push("HAS_BASECOLOR_UV_TRANSFORM 1");
	    }
      features.push("HAS_BASE_COLOR_MAP 1")
    }
    if (material.emissiveTexture) {
      if (!material.emissiveTexture.valid) {
        return undefined
      }
	    if ((<any>material.emissiveTexture).uvTransform) {
		    features.push("HAS_EMISSIVE_UV_TRANSFORM 1");
	    }
      features.push("HAS_EMISSIVE_MAP 1")
    }
    if (material.normalTexture) {
      if (!material.normalTexture.valid) {
        return undefined
      }
	    if ((<any>material.normalTexture).uvTransform) {
		    features.push("HAS_NORMAL_UV_TRANSFORM 1");
	    }
      features.push("HAS_NORMAL_MAP 1")
    }
    if (material.metallicRoughnessTexture) {
      if (!material.metallicRoughnessTexture.valid) {
        return undefined
      }
	    if ((<any>material.metallicRoughnessTexture).uvTransform) {
		    features.push("HAS_METALLICROUGHNESS_UV_TRANSFORM 1");
	    }
      features.push("HAS_METALLIC_ROUGHNESS_MAP 1")
    }
    if (material.occlusionTexture) {
      if (!material.occlusionTexture.valid) {
        return undefined
      }
	    if ((<any>material.occlusionTexture).uvTransform) {
		    features.push("HAS_OCCLUSION_UV_TRANSFORM 1");
	    }
      features.push("HAS_OCCLUSION_MAP 1")
    }
    switch (material.alphaMode) {
      case StandardMaterialAlphaMode.opaque: {
        features.push("ALPHAMODE_OPAQUE 1")
        break
      }
      case StandardMaterialAlphaMode.mask: {
        features.push("ALPHAMODE_MASK 1")
        break
      }
    }
    if (material.debugMode) {
      features.push("DEBUG_OUTPUT 1")
    }
    switch (material.debugMode) {
      case StandardMaterialDebugMode.alpha: {
        features.push("DEBUG_ALPHA 1")
        break
      }
      case StandardMaterialDebugMode.emissive: {
        features.push("DEBUG_EMISSIVE 1")
        break
      }
      case StandardMaterialDebugMode.f0: {
        features.push("DEBUG_F0 1")
        break
      }
      case StandardMaterialDebugMode.metallic: {
        features.push("DEBUG_METALLIC 1")
        break
      }
      case StandardMaterialDebugMode.normal: {
        features.push("DEBUG_NORMAL 1")
        break
      }
      case StandardMaterialDebugMode.occlusion: {
        features.push("DEBUG_OCCLUSION 1")
        break
      }
      case StandardMaterialDebugMode.roughness: {
        features.push("DEBUG_ROUGHNESS 1")
        break
      }
    }
    return features
  }

  function isJointMatrixTextureRequired(jointsCount: number, renderer: PIXI.Renderer) {
    let uniformsRequiredForMostFeatures = 25
    let availableJointUniforms =
      Platform.getMaxVertexUniformVectors(renderer) - uniformsRequiredForMostFeatures
    let uniformsRequiredPerJoint = 8
    return jointsCount > Math.floor(availableJointUniforms / uniformsRequiredPerJoint)
  }

  export function hasSkinningTextureFeature(features: string[]) {
    return features.includes("USE_SKINNING_TEXTURE 1")
  }
}