const EXTENSION = "bin"

export const glTFBufferLoader = {
  use: function (resource: any, next: () => void) {
    if (resource.extension !== EXTENSION || !resource.metadata) {
      return next()
    }
    resource.metadata.gltf.buffers[resource.metadata.index] = resource.data
    next()
  },
  add: function () {
    PIXI.LoaderResource.setExtensionXhrType(
      EXTENSION, PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER)
  }
}

if (PIXI) {
  PIXI.Loader.registerPlugin(glTFBufferLoader)
}