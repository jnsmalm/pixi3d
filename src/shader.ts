import { Material } from "./material"
import { MeshGeometryData, Mesh3D } from "./mesh"

export interface Shader extends PIXI.Shader {
  updateUniforms(mesh: Mesh3D): void
  createGeometry(data: MeshGeometryData): PIXI.Geometry
  createMaterial?(material?: Material): Material
}

export enum MeshShaderAttribute {
  position = "position",
  uv = "uv",
  normal = "normal",
  tangent = "tangent"
}

export abstract class MeshShader extends PIXI.Shader implements Shader {
  constructor(program: PIXI.Program, public attributes: MeshShaderAttribute[] = []) {
    super(program)
  }

  createGeometry(data: MeshGeometryData): PIXI.Geometry {
    let geometry = new PIXI.Geometry()
    if (data.indices) {
      geometry.addIndex(data.indices.buffer)
    }
    if (this.attributes.includes(MeshShaderAttribute.position)) {
      geometry.addAttribute("position", data.positions.buffer, 3, false,
        PIXI.TYPES.FLOAT, data.positions.stride)
    }
    if (this.attributes.includes(MeshShaderAttribute.uv)) {
      if (data.texCoords) {
        geometry.addAttribute("uv", data.texCoords.buffer, 2, false,
          PIXI.TYPES.FLOAT, data.texCoords.stride)
      }
    }
    if (this.attributes.includes(MeshShaderAttribute.normal)) {
      if (data.normals) {
        geometry.addAttribute("normal", data.normals.buffer, 3, false,
          PIXI.TYPES.FLOAT, data.normals.stride)
      }
    }
    if (this.attributes.includes(MeshShaderAttribute.tangent)) {
      if (data.tangents) {
        geometry.addAttribute("tangent", data.tangents.buffer, 4, false,
          PIXI.TYPES.FLOAT, data.tangents.stride)
      }
    }
    return geometry
  }

  abstract updateUniforms(mesh: Mesh3D): void
}