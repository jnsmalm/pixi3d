import type { ILoaderResource } from "@pixi/loaders"

/**
 * Represents a loader for glTF asset resources (buffers and images).
 */
export interface glTFResourceLoader {
  /**
   * Loads the resource from the specified uri.
   * @param uri The uri to load from.
   * @param onComplete Callback when loading is completed.
   */
  load(uri: string, 
    onComplete: (resource: ILoaderResource) => void): void
}