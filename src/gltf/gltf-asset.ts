import { settings } from "@pixi/settings"
import { Texture } from "@pixi/core"
import { glTFResourceLoader } from "./gltf-resource-loader"
import type { LoaderResource } from "@pixi/loaders"
import { Compatibility } from "../compatibility/compatibility"

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
   * @param cb Callback when all resources have been loaded.
   */
  static load(descriptor: any, loader?: glTFResourceLoader, cb?: (asset: glTFAsset) => void) {
    let asset = new glTFAsset(descriptor)
    loadBuffers(descriptor, buffers => {
      buffers.forEach(buffer => asset.buffers.push(buffer))
      loadImages(descriptor, buffers, images => {
        images.forEach(image => asset.images.push(image))
        cb && cb(asset)
      }, loader)
    }, loader)
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
    return uri && uri.startsWith("data:")
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
    loadImages(descriptor, buffers, images => {
      cb(new glTFAsset(descriptor, buffers, images))
    })
  }

  /**
   * Loads a gltf asset from the specified url. This feature is only available
   * when using PixiJS v7+.
   * @param url The url to load.
   */
  static async fromURL(url: string, options?: RequestInit | undefined): Promise<glTFAsset> {
    if (!Compatibility.assets) {
      throw new Error("PIXI3D: This feature is only available when using PixiJS v7+")
    }
    const response = await settings.ADAPTER.fetch(url, options)
    return new Promise<glTFAsset>(async (resolve) => {
      if (url.includes(".glb")) {
        let buffer = await response.arrayBuffer()
        glTFAsset.fromBuffer(buffer, gltf => {
          resolve(gltf)
        })
      } else {
        let descriptor = await response.json()
        glTFAsset.load(descriptor, new ResourceLoader(url), gltf => {
          resolve(gltf)
        })
      }
    })
  }
}

class ResourceLoader implements glTFResourceLoader {
  constructor(private parentURL: string) {
  }

  load(uri: string, onComplete: (resource: LoaderResource) => void): void {
    const url = this.parentURL.substring(
      0, this.parentURL.lastIndexOf("/") + 1) + uri
    const loadAsync = async () => {
      if (!Compatibility.assets) {
        throw new Error("PIXI3D: Assets are not available in current version of PixiJS.")
      }
      let resource: { data?: ArrayBuffer, texture?: Texture } = {}
      if (url.includes(".bin")) {
        const response = await settings.ADAPTER.fetch(url)
        resource.data = await response.arrayBuffer()
      } else {
        let texture = await Compatibility.assets.load<Texture>(url)
        if (texture) {
          // @ts-ignore
          resource.texture = texture
        }
      }
      // @ts-ignore
      onComplete(resource)
    }
    loadAsync()
  }
}

function loadImages(descriptor: any, buffers: ArrayBuffer[], cb: (images: Texture[]) => void, loader?: glTFResourceLoader) {
  const images: Texture[] = []

  if (!descriptor.images || descriptor.images.length === 0) {
    return cb(images)
  }

  let embeddedImages = descriptor.images
    .filter((img: any) => typeof img.bufferView !== "number" && glTFAsset.isEmbeddedResource(img.uri))
    .map((img: any, index: number) => index)

  let externalImages = descriptor.images
    .filter((img: any) => typeof img.bufferView !== "number" && !glTFAsset.isEmbeddedResource(img.uri))
    .map((img: any, index: number) => index)

  let bufferImages = descriptor.images
    .filter((img: any) => typeof img.bufferView === "number")
    .map((img: any, index: number) => index)

  for (let i = 0; i < embeddedImages.length; i++) {
    let index = embeddedImages[i]
    let image: { uri: string } = descriptor.images[index]
    images[index] = Texture.from(image.uri)
  }

  if (bufferImages.length === 0 && externalImages.length === 0) {
    return cb(images)
  }
  if (externalImages.length > 0 && !loader) {
    throw new Error("PIXI3D: A resource loader is required when image is external.")
  }

  const loadExternalImage = (image: any, index: number, cb: () => void) => {
    loader?.load(image.uri, (resource) => {
      if (resource.texture) {
        images[index] = resource.texture; cb()
      }
    })
  }
  const loadBufferImage = (image: any, index: number, cb: () => void) => {
    loadImageFromBuffer(image, descriptor, buffers, image => {
      images[index] = image; cb()
    })
  }
  let externalImagesCount = externalImages.length
  let bufferImagesCount = bufferImages.length

  for (let i = 0; i < externalImages.length; i++) {
    let index = externalImages[i]
    let image: { bufferView: number, uri: string } = descriptor.images[index]
    loadExternalImage(image, index, () => {
      if (--externalImagesCount === 0 && bufferImagesCount === 0) {
        cb(images)
      }
    })
  }
  for (let i = 0; i < bufferImages.length; i++) {
    let index = bufferImages[i]
    let image: { bufferView: number, uri: string } = descriptor.images[index]
    loadBufferImage(image, index, () => {
      if (--bufferImagesCount === 0 && externalImagesCount === 0) {
        cb(images)
      }
    })
  }
}

function loadBuffers(descriptor: any, cb: (buffers: ArrayBuffer[]) => void, loader?: glTFResourceLoader) {
  const buffers: ArrayBuffer[] = []

  const embeddedBuffers = descriptor.buffers
    .filter((buffer: any) => glTFAsset.isEmbeddedResource(buffer.uri))
    .map((buffer: any, index: number) => index)

  for (let i = 0; i < embeddedBuffers.length; i++) {
    let index = embeddedBuffers[i]
    let buffer = descriptor.buffers[index]
    buffers[index] = createBufferFromBase64(buffer.uri)
  }

  const externalBuffers = descriptor.buffers
    .filter((buffer: any) => !glTFAsset.isEmbeddedResource(buffer.uri))
    .map((buffer: any, index: number) => index)

  if (externalBuffers.length === 0) {
    return cb(buffers)
  }
  if (!loader) {
    throw new Error("PIXI3D: A resource loader is required when buffer is not embedded.")
  }

  const loadExternalBuffer = (uri: string, index: number, cb: () => void) => {
    loader.load(uri, (resource) => {
      buffers[index] = resource.data
      cb()
    })
  }

  let externalBuffersCount = externalBuffers.length
  for (let i = 0; i < externalBuffers.length; i++) {
    let index = externalBuffers[i]
    let buffer = descriptor.buffers[index]
    loadExternalBuffer(buffer.uri, index, () => {
      if (--externalBuffersCount === 0) {
        cb(buffers)
      }
    })
  }
}

function loadImageFromBuffer(image: any, descriptor: any, buffers: ArrayBuffer[], cb: (image: Texture) => void) {
  const view = descriptor.bufferViews[image.bufferView]
  const array = new Uint8Array(buffers[view.buffer], view.byteOffset, view.byteLength)
  const blob = new Blob([array], { "type": image.mimeType })
  const reader = new FileReader()
  reader.onload = () => {
    cb(Texture.from(<string>reader.result))
  }
  reader.readAsDataURL(blob)
}

function createBufferFromBase64(value: string) {
  return Uint8Array.from(atob(value.split(",")[1]), c => c.charCodeAt(0)).buffer
}