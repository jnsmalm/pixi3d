import * as PIXI from "pixi.js"

/**
 * glTF assets are JSON files plus supporting external data.
 */
export class glTFAsset {
  private _buffers: ArrayBuffer[] = []
  private _images: PIXI.Texture[] = []
  private _descriptor: any

  /**
   * Creates a new glTF asset using the specified JSON descriptor. The resources 
   * (buffers and images) will not be loaded automatically.
   * @param descriptor The JSON descriptor to create the asset from.
   */
  constructor(descriptor: any) {
    this._descriptor = descriptor
  }

  /** The images used by this asset. */
  get images() {
    return this._images
  }

  /** The descriptor used by this asset. */
  get descriptor() {
    return this._descriptor
  }

  /** The buffers used by this asset. */
  get buffers() {
    return this._buffers
  }

  /**
   * Loads a new glTF asset (including resources) using the specified JSON 
   * descriptor.
   * @param descriptor The JSON descriptor to create the asset from.
   * @param loader The resource loader to use for external resources. The 
   * loader can be empty when all resources in the descriptor is embedded.
   */
  static load(descriptor: any, loader?: glTFAssetResourceLoader) {
    let asset = new glTFAsset(descriptor)

    for (let i = 0; i < descriptor.buffers.length; i++) {
      let buffer: { uri: string } = descriptor.buffers[i]
      if (glTFAsset.isEmbeddedResource(buffer.uri)) {
        asset._buffers[i] = glTFAsset.getEmbeddedBuffer(buffer.uri)
      } else {
        if (!loader) {
          throw new Error("PIXI3D: A resource loader is required when buffer is not embedded.")
        }
        loader.load(buffer.uri, (resource) => {
          asset._buffers[i] = resource.data
        })
      }
    }
    if (!descriptor.images) {
      return asset
    }
    for (let i = 0; i < descriptor.images.length; i++) {
      let image: { uri: string } = descriptor.images[i]
      if (glTFAsset.isEmbeddedResource(image.uri)) {
        asset._images[i] = PIXI.Texture.from(image.uri, {
          wrapMode: PIXI.WRAP_MODES.REPEAT
        })
      } else {
        if (!loader) {
          throw new Error("PIXI3D: A resource loader is required when image is not embedded.")
        }
        loader.load(image.uri, (resource) => {
          resource.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
          asset._images[i] = resource.texture
        })
      }
    }
    return asset
  }

  static isEmbeddedResource(uri: string) {
    return uri.startsWith("data:")
  }

  static getEmbeddedBuffer(value: string) {
    return Uint8Array.from(atob(value.split(",")[1]), c => c.charCodeAt(0)).buffer
  }
}

/**
 * Represents a loader for glTF asset resources (buffers and images).
 */
export interface glTFAssetResourceLoader {
  /**
   * Loads the resource from the specified uri.
   * @param uri The uri to load from.
   * @param onComplete Callback when loading is completed.
   */
  load(uri: string,
    onComplete: (resource: PIXI.LoaderResource) => void): void
}