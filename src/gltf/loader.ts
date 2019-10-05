PIXI.Loader.registerPlugin({
  use(resource, next) {
    if (resource.extension !== "gltf") {
      return next()
    }
    for (let buffer of resource.data.buffers) {
      (this as PIXI.Loader).add({
        name: buffer.uri,
        url: resource.url.substring(0, resource.url.lastIndexOf("/") + 1) + buffer.uri,
        parentResource: resource
      })
    }
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
  },
  add() {
    PIXI.LoaderResource.setExtensionXhrType(
      "bin", PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
})