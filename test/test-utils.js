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
      // Sprite is added as watermark to be able to tell orientation of the
      // image, due to a bug in Safari where the image is read upside-down.
      let watermark = Object.assign(
        new PIXI.Sprite(PIXI.Texture.WHITE), { width: 1, height: 1, })
      if (PIXI.VERSION.substring(0, 1) === "5") {
        renderer.render(watermark, undefined, false)
      }
      if (PIXI.VERSION.substring(0, 1) === "6") {
        renderer.render(watermark, { clear: false })
      }
      renderer.view.toBlob(blob => {
        resolve(URL.createObjectURL(blob))
        renderer.destroy()
        PIXI.utils.clearTextureCache()
      })
    })
  })
  return result
}

export async function getImageDataFromUrl(url, flipped) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = url
    image.onload = () => {
      let canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      let ctx = canvas.getContext("2d")
      if (flipped) {
        ctx.translate(0, canvas.height)
        ctx.scale(1, -1)
      }
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
  let url = await getObjectURLFromRender(render, resources, width, height)
  let imageData = await getImageDataFromUrl(url, false)
  let flipped = imageData.data[0] !== 255
  if (flipped) {
    imageData = await getImageDataFromUrl(url, true)
  }
  return imageData
}