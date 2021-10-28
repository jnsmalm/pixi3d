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
      renderer.render(Object.assign(new PIXI.Sprite(PIXI.Texture.WHITE), {
        alpha: 0.5, width: 1, height: 1,
      }), undefined, false)
      setTimeout(() => {
        renderer.view.toBlob(blob => {
          resolve(URL.createObjectURL(blob))
          renderer.destroy()
        })
      }, 100)
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
      setTimeout(() => resolve({
        data: imageData.data,
        height: imageData.height,
        width: imageData.width,
        url
      }), 100)
    }
  })
}

export async function getImageDataFromRender(render, resources, width = 1280, height = 720) {
  let url = await getObjectURLFromRender(render, resources, width, height)
  let imageData = await getImageDataFromUrl(url, false)
  let flipped = imageData.data[0] !== 230
  if (flipped) {
    imageData = await getImageDataFromUrl(url, true)
  }
  return imageData
}