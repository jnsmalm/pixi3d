import { Mesh3D } from "../mesh/mesh"

/**
 * Represents a pass used when rendering.
 */
export interface RenderPass {
  /** The name of the render pass. */
  name: string

  /** Clears the render pass. Used when rendering to a texture. */
  clear?(): void

  /**
   * Renders the specified meshes.
   * @param meshes The array of meshes to render.
   */
  render(meshes: Mesh3D[]): void
}