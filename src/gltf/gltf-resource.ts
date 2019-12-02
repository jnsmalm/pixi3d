export class glTFResource {
  buffers: ArrayBuffer[] = []
  images: PIXI.Texture[] = []

  constructor(public descriptor: any) {
    for (let i = 0; i < descriptor.buffers.length; i++) {
      let buffer: { uri: string } = descriptor.buffers[i]
      if (glTFResource.isEmbeddedBuffer(buffer.uri)) {
        this.buffers[i] = glTFResource.getEmbeddedBuffer(buffer.uri)
      }
    }
    if (!descriptor.images) {
      return this
    }
    for (let i = 0; i < descriptor.images.length; i++) {
      let image: { uri: string } = descriptor.images[i]
      if (glTFResource.isEmbeddedImage(image.uri)) {
        this.images[i] = PIXI.Texture.from(image.uri)
      }
    }
  }

  static fromExternalResources(descriptor: any, loader: PIXI.Loader, resource: any) {
    let gltf = new glTFResource(descriptor)

    for (let i = 0; i < gltf.descriptor.buffers.length; i++) {
      let buffer: { uri: string } = gltf.descriptor.buffers[i]
      if (glTFResource.isEmbeddedBuffer(buffer.uri)) {
        continue
      }
      loader.add({
        metadata: { gltf: gltf, index: i },
        name: buffer.uri,
        url: resource.url.substring(0,
          resource.url.lastIndexOf("/") + 1) + buffer.uri,
        parentResource: resource,
      })
    }
    if (!gltf.descriptor.images) {
      return gltf
    }
    for (let i = 0; i < gltf.descriptor.images.length; i++) {
      let image: { uri: string } = gltf.descriptor.images[i]
      if (glTFResource.isEmbeddedImage(image.uri)) {
        continue
      }
      gltf.images.push(PIXI.Texture.from(resource.url.substring(
        0, resource.url.lastIndexOf("/") + 1) + image.uri))
    }
    return gltf
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