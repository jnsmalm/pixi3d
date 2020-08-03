import { Material } from "./material"

/**
 * Factory for creating materials.
 */
export interface MaterialFactory {
  /** Creates a new material from the specified source. */
  create(source: unknown): Material
}