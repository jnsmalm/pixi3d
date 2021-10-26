async function getObjectURLFromRender(render, resources, width = 1280, height = 720) {
  let renderer = new PIXI.Renderer({ width, height, backgroundColor: 0xcccccc })
  let loader = new PIXI.Loader()
  if (resources) {
    resources.forEach(res => { loader.add(res) })
  }
  let result = new Promise((resolve, reject) => {
    loader.load((_, resources) => {
      render(renderer, resources)
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

export async function getImageDataFromUrl(url, width = 1280, height = 720) {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    let context = canvas.getContext("2d")
    let image = new Image()
    image.src = url
    image.onload = () => {
      context.drawImage(image, 0, 0)
      setTimeout(() => resolve({
        imageData: context.getImageData(0, 0, width, height),
        url
      }), 100)
    }
  })
}

export async function getImageDataFromRender(render, resources, width = 1280, height = 720) {
  return await getImageDataFromUrl(
    await getObjectURLFromRender(render, resources, width, height), width, height)
}