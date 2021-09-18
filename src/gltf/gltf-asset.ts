import { Texture } from "pixi.js"
import { glTFResourceLoader } from "./gltf-resource-loader"

/**
 * glTF assets are JSON files plus supporting external data.
 */
export class glTFAsset {
  /**
   * Creates a new glTF asset using the specified JSON descriptor.
   * @param descriptor The JSON descriptor to create the asset from.
   * @param buffers The buffers used by this asset.
   * @param images The images used by this asset.
   */
  constructor(readonly descriptor: any, readonly buffers: ArrayBuffer[] = [], readonly images: Texture[] = []) { }

  /**
   * Loads a new glTF asset (including resources) using the specified JSON 
   * descriptor.
   * @param descriptor The JSON descriptor to create the asset from.
   * @param loader The resource loader to use for external resources. The 
   * loader can be empty when all resources in the descriptor is embedded.
   */
  static load(descriptor: any, loader?: glTFResourceLoader) {
    let asset = new glTFAsset(descriptor)

    for (let i = 0; i < descriptor.buffers.length; i++) {
      let buffer: { uri: string } = descriptor.buffers[i]
      if (glTFAsset.isEmbeddedResource(buffer.uri)) {
        asset.buffers[i] = createBufferFromBase64(buffer.uri)
      } else {
        if (!loader) {
          throw new Error("PIXI3D: A resource loader is required when buffer is not embedded.")
        }
        loader.load(buffer.uri, (resource) => {
          asset.buffers[i] = resource.data
        })
      }
    }
    if (!descriptor.images) {
      return asset
    }
    for (let i = 0; i < descriptor.images.length; i++) {
      let image: { uri: string } = descriptor.images[i]
      if (glTFAsset.isEmbeddedResource(image.uri)) {
        asset.images[i] = Texture.from(image.uri)
      } else {
        if (!loader) {
          throw new Error("PIXI3D: A resource loader is required when image is not embedded.")
        }
        loader.load(image.uri, (resource) => {
          if (resource.texture) {
            asset.images[i] = resource.texture
          }
        })
      }
    }
    return asset
  }

  /**
   * Returns a value indicating if the specified data buffer is a valid glTF.
   * @param buffer The buffer data to validate.
   */
  static isValidBuffer(buffer: ArrayBuffer) {
    const header = new Uint32Array(buffer, 0, 3)
    if (header[0] === 0x46546C67 && header[1] === 2) {
      return true
    }
    return false
  }

  /**
   * Returns a value indicating if the specified uri is embedded.
   * @param uri The uri to check.
   */
  static isEmbeddedResource(uri: string) {
    return uri.startsWith("data:")
  }

  /**
   * Creates a new glTF asset from binary (glb) buffer data.
   * @param data The binary buffer data to read from.
   * @param cb The function which gets called when the asset has been 
   * created.
   */
  static fromBuffer(data: ArrayBuffer, cb: (gltf: glTFAsset) => void) {
    const chunks: { type: number, offset: number, length: number }[] = []
    let offset = 3 * 4
    while (offset < data.byteLength) {
      const header = new Uint32Array(data, offset, 3)
      chunks.push({
        length: header[0], type: header[1], offset: offset + 2 * 4
      })
      offset += header[0] + 2 * 4
    }
    const json = new Uint8Array(data, chunks[0].offset, chunks[0].length)
    const descriptor = JSON.parse(new TextDecoder("utf-8").decode(json))
    const buffers: ArrayBuffer[] = []
    for (let i = 1; i < chunks.length; i++) {
      buffers.push(data.slice(chunks[i].offset, chunks[i].offset + chunks[i].length))
    }
    if (!descriptor.images || descriptor.images.length === 0) {
      cb(new glTFAsset(descriptor, buffers))
    }
    const images: Texture[] = []
    for (let i = 0; descriptor.images && i < descriptor.images.length; i++) {
      const image = descriptor.images[i]
      if (image.bufferView === undefined) {
        continue
      }
      const view = descriptor.bufferViews[image.bufferView]
      const buffer = buffers[view.buffer]
      const array = new Uint8Array(buffer, view.byteOffset, view.byteLength)
      const blob = new Blob([array], { "type": image.mimeType })
      const reader = new FileReader()
      reader.onload = () => {
        images[i] = Texture.from(<string>reader.result)
        if (images.length === descriptor.images.length) {
          cb(new glTFAsset(descriptor, buffers, images))
        }
      }
      reader.readAsDataURL(blob)
    }
  }
}

function createBufferFromBase64(value: string) {
  return Uint8Array.from(atob(value.split(",")[1]), c => c.charCodeAt(0)).buffer
}