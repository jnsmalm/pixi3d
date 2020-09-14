import { Mesh3D } from "../mesh/mesh"

/**
 * Represents a pass used when rendering.
 */
export interface RenderPass {
  /**
   * Clears the render pass. Most often used when rendering to a texture.
   */
  clear?(): void

  /** The name of the render pass. */
  name: string

  /**
   * Renders the specified meshes.
   * @param meshes The array of meshes to render.
   */
  render(meshes: Mesh3D[]): void
}