export namespace glTFLoader {
  export const resources: {
    [source: string]: {
      descriptor: any,
      buffers: ArrayBuffer[],
      images: PIXI.Texture[]
    }
  } = {}
}

PIXI.Loader.registerPlugin({
  use(resource, next) {
    if (resource.extension !== "gltf") {
      return next()
    }
    glTFLoader.resources[resource.name] = {
      buffers: [],
      descriptor: resource.data,
      images: []
    }
    for (let i = 0; i < resource.data.buffers.length; i++) {
      let buffer: { uri: string } = resource.data.buffers[i];
      (this as PIXI.Loader).add({
        name: buffer.uri,
        url: resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + buffer.uri,
        parentResource: resource,
        metadata: { name: resource.name, buffer: i }
      })
    }
    if (resource.data.images) {
      for (let i = 0; i < resource.data.images.length; i++) {
        let image: { uri: string } = resource.data.images[i];
        (this as PIXI.Loader).add({
          name: image.uri,
          url: resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + image.uri,
          parentResource: resource,
          metadata: { name: resource.name, image: i }
        })
      }
    }
    next()
  },
  add() {
    PIXI.LoaderResource.setExtensionXhrType(
      "gltf", PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON)
  }
})

PIXI.Loader.registerPlugin({
  use(resource, next) {
    if (resource.extension !== "bin") {
      return next()
    }
    glTFLoader.resources[resource.metadata.name].buffers[resource.metadata.buffer] = resource.data
    next()
  },
  add() {
    PIXI.LoaderResource.setExtensionXhrType(
      "bin", PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
})

PIXI.Loader.registerPlugin({
  use(resource, next) {
    if (resource.type !== PIXI.LoaderResource.TYPE.IMAGE || !resource.texture || !resource.metadata.name) {
      return next()
    }
    glTFLoader.resources[resource.metadata.name].images[resource.metadata.image] = resource.texture
    next()
  }
})