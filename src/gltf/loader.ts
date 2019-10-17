export namespace glTFLoader {
  export const resources: {
    [source: string]: {
      descriptor: any,
      buffers: ArrayBuffer[],
      textures: PIXI.Texture[]
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
      textures: []
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
    if (resource.data.textures) {
      for (let i = 0; i < resource.data.textures.length; i++) {
        let source = resource.data.textures[i].source
        let image: { uri: string } = resource.data.images[source];
        (this as PIXI.Loader).add({
          name: image.uri,
          url: resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + image.uri,
          parentResource: resource,
          metadata: { name: resource.name, texture: i }
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
    if (resource.type !== PIXI.LoaderResource.TYPE.IMAGE || !resource.texture) {
      return next()
    }
    glTFLoader.resources[resource.metadata.name].textures[resource.metadata.texture] = resource.texture
    next()
  }
})