import * as PIXI from "pixi.js"

export interface glTFAssetResourceLoader {
  load(uri: string, onComplete: (resource: PIXI.LoaderResource) => void): void
}

/**
 * glTF assets are JSON files plus supporting external data.
 */
export class glTFAsset {
  buffers: ArrayBuffer[] = []
  images: PIXI.Texture[] = []

  constructor(public descriptor: any) {
    //
  }

  static load(descriptor: any, resourceLoader?: glTFAssetResourceLoader) {
    let asset = new glTFAsset(descriptor)

    for (let i = 0; i < descriptor.buffers.length; i++) {
      let buffer: { uri: string } = descriptor.buffers[i]
      if (glTFAsset.isEmbeddedBuffer(buffer.uri)) {
        asset.buffers[i] = glTFAsset.getEmbeddedBuffer(buffer.uri)
      } else {
        if (!resourceLoader) {
          throw new Error("PIXI3D: A resource loader is required when buffer is not embedded.")
        }
        resourceLoader.load(buffer.uri, (resource) => {
          asset.buffers[i] = resource.data
        })
      }
    }
    if (descriptor.images) {
      for (let i = 0; i < descriptor.images.length; i++) {
        let image: { uri: string } = descriptor.images[i]
        if (glTFAsset.isEmbeddedImage(image.uri)) {
          asset.images[i] = PIXI.Texture.from(image.uri)
        } else {
          if (!resourceLoader) {
            throw new Error("PIXI3D: A resource loader is required when image is not embedded.")
          }
          resourceLoader.load(image.uri, (resource) => {
            asset.images[i] = resource.texture
          })
        }
      }
    }
    return asset
  }

  static isEmbeddedImage(uri: string) {
    return uri.startsWith("data:image")
  }

  static getEmbeddedBuffer(value: string) {
    return Uint8Array.from(
      atob(value.split(",")[1]), c => c.charCodeAt(0)).buffer
  }

  static isEmbeddedBuffer(uri: string) {
    return uri.startsWith("data:application/octet-stream")
  }
}