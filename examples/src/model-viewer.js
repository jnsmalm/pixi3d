let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

document.getElementById("message").style.display = "block"
document.getElementById("message").innerText = "Load gltf models by dragging and dropping files to this window"

let control = new PIXI3D.CameraOrbitControl(app.view)

window.addEventListener("dragover", (e) => {
  e.preventDefault()
  e.dataTransfer.dropEffect = "copy"
})

window.addEventListener("drop", (e) => {
  e.preventDefault()
  for (let file of e.dataTransfer.files) {
    resourceLoader.add(file)
  }
})

class glTFLocalResourceLoader {
  constructor(onComplete) {
    this.resources = {}
    this.onComplete = onComplete
  }

  get descriptor() {
    let gltf = Object.keys(this.resources).find((name) => name.endsWith("gltf"))
    if (gltf) {
      return JSON.parse(this.resources[gltf])
    }
  }

  isComplete() {
    if (!this.descriptor) { return false }

    for (let buffer of this.descriptor.buffers) {
      if (!PIXI3D.glTFAsset.isEmbeddedBuffer(buffer.uri)) {
        if (!Object.keys(this.resources).includes(buffer.uri)) {
          return false
        }
      }
    }
    if (this.descriptor.images) {
      for (let image of this.descriptor.images) {
        if (!PIXI3D.glTFAsset.isEmbeddedImage(image.uri)) {
          if (!Object.keys(this.resources).find((name) => { return image.uri.indexOf(name) >= 0 })) {
            return false
          }
        }
      }
    }
    return true
  }

  clear() {
    this.resources = {}
  }

  add(file) {
    let reader = new FileReader()
    reader.onload = () => {
      this.resources[file.name] = reader.result
      if (this.isComplete()) {
        this.onComplete(this.descriptor)
      }
    }
    if (file.name.endsWith("gltf")) {
      reader.readAsText(file)
    }
    if (file.name.endsWith("bin")) {
      reader.readAsArrayBuffer(file)
    }
    if (file.name.endsWith("png") || file.name.endsWith("jpg") || file.name.endsWith("jpeg")) {
      reader.readAsDataURL(file)
    }
  }

  load(uri, onComplete) {
    uri = uri.substring(uri.lastIndexOf("/") + 1)
    if (uri.endsWith("bin")) {
      onComplete({
        data: this.resources[uri]
      })
    } else {
      onComplete({
        texture: PIXI.Texture.from(this.resources[uri])
      })
    }
  }
}

let model, resourceLoader = new glTFLocalResourceLoader((descriptor) => {
  let asset = new PIXI3D.glTFAsset.load(descriptor, resourceLoader)
  resourceLoader.clear()
  app.stage.removeChildren()
  model = app.stage.addChild(PIXI3D.Model3D.from(
    asset, PIXI3D.PhysicallyBasedMaterial.factory(material)))
  gui.show()
  document.getElementById("message").style.display = "none"
})

app.loader.add("diffuse.cubemap", "assets/environments/autumn/diffuse.cubemap")
app.loader.add("specular.cubemap", "assets/environments/autumn/specular.cubemap")

app.loader.load((loader, resources) => {
  PIXI3D.LightingEnvironment.main =
    new PIXI3D.LightingEnvironment(new PIXI3D.ImageBasedLighting(
      resources["diffuse.cubemap"].texture,
      resources["specular.cubemap"].texture))
})

let material = {
  exposure: 3,
  roughness: 1,
  metallic: 1,
  debug: "",
  unlit: false
}

let gui = new dat.GUI()
gui.hide()

gui.add(material, "exposure", 0, 10).onChange((value) => {
  for (let mesh of model.meshes) {
    mesh.material.exposure = value
  }
})
gui.add(material, "roughness", 0, 1).onChange((value) => {
  for (let mesh of model.meshes) {
    mesh.material.roughness = value
  }
})
gui.add(material, "metallic", 0, 1).onChange((value) => {
  for (let mesh of model.meshes) {
    mesh.material.metallic = value
  }
})
gui.add(material, "unlit").onChange((value) => {
  for (let mesh of model.meshes) {
    mesh.material.unlit = value
  }
})
gui.add(material, "debug", { none: "", alpha: "alpha", emissive: "emissive", f0: "f0", metallic: "metallic", normal: "normal", occlusion: "occlusion", roughness: "roughness" }).onChange((value) => {
  for (let mesh of model.meshes) {
    mesh.material.debugMode = value
  }
})
