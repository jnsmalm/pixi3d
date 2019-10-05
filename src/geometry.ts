import { MeshData } from "./mesh"

export interface GeometryFactory {
  create(data: MeshData): PIXI.Geometry
}

export class BasicGeometryFactory implements GeometryFactory {
  create(data: MeshData) {
    let geometry = new PIXI.Geometry()
    geometry.addAttribute("position", data.positions, 3)
    geometry.addIndex(new Uint16Array(data.indices))
    return geometry
  }
}