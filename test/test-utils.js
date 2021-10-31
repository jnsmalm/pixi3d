async function getObjectURLFromRender(render, resources, width = 1280, height = 720) {
  let renderer = new PIXI.Renderer({
    width, height, backgroundColor: 0xcccccc
  })
  let loader = new PIXI.Loader()
  if (resources) {
    resources.forEach(res => { loader.add(res) })
  }
  let result = new Promise((resolve, reject) => {
    loader.load((_, resources) => {
      render(renderer, resources)
      let canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      let ctx = canvas.getContext("2d")
      ctx.drawImage(renderer.view, 0, 0)
      canvas.toBlob(blob => {
        resolve(URL.createObjectURL(blob))
        renderer.destroy()
        PIXI.utils.clearTextureCache()
      })
    })
  })
  return result
}

export async function getImageDataFromUrl(url) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = url
    image.onload = () => {
      let canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      let ctx = canvas.getContext("2d")
      ctx.drawImage(image, 0, 0)
      let imageData = ctx.getImageData(0, 0, image.width, image.height)
      resolve({
        data: imageData.data,
        height: imageData.height,
        width: imageData.width,
        url
      })
    }
  })
}

export async function getImageDataFromRender(render, resources, width = 1280, height = 720) {
  return await getImageDataFromUrl(
    await getObjectURLFromRender(render, resources, width, height), false)
}