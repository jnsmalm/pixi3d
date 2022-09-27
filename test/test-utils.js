async function loadResources(urls) {
  let resources = {}
  if (PIXI.Assets) {
    for (let url of urls || []) {
      let asset = await PIXI.Assets.load(url)
      resources[url] = {
        gltf: asset, texture: asset, cubemap: asset
      }
    }
  } else {
    let loader = new PIXI.Loader()
    if (urls) {
      urls.forEach(res => { loader.add(res) })
    }
    return new Promise((resolve, reject) => {
      loader.load((_, resources) => {
        resolve(resources)
      })
    })
  }
  return resources
}

async function getObjectURLFromRender(render, urls, { width = 1280, height = 720, webGL = 1 } = {}) {
  // switch (webGL) {
  //   case 1: {
  //     PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL1
  //     break
  //   }
  //   case 2: {
  //     PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2
  //     break
  //   }
  // }
  let renderer = new PIXI.Renderer({
    width, height, backgroundColor: 0xcccccc
  })
  let resources = await loadResources(urls)
  return new Promise(async (resolve, reject) => {
    await render(renderer, resources)
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
}

async function getImageDataFromUrl(url) {
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

async function getImageDataFromRender(render, resources, options = {}) {
  return await getImageDataFromUrl(
    await getObjectURLFromRender(render, resources, { ...options }), false)
}

export async function delayedRender(renderer, object, delay = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      renderer.render(object)
      resolve()
    }, delay)
  })
}