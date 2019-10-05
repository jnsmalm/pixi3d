export namespace glTFLoader {
  export const resources: { [source: string]: { descriptor: any, buffers: ArrayBuffer[] } } = {}
}

PIXI.Loader.registerPlugin({
  use(resource, next) {
    if (resource.extension !== "gltf") {
      return next()
    }
    glTFLoader.resources[resource.name] = {
      descriptor: resource.data, buffers: []
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