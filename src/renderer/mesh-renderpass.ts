import { Mesh3D } from "../mesh/mesh"

export interface MeshRenderPass {
  name: string
  render(meshes: Mesh3D[]): void
  clear?(): void
}