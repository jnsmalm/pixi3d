let app = new PIXI.Application({
  backgroundColor: 0xdddddd, resizeTo: window, antialias: true
})
document.body.appendChild(app.view)

class Bunny extends PIXI3D.Sprite3D {
  constructor(texture) {
    super(texture)

    this.position.set(-5 + Math.random() * 10, 0, -5 + Math.random() * 10)

    this.speedX = -0.01 + Math.random() * 0.02
    this.speedY = Math.random() * 10
    this.speedZ = -0.01 + Math.random() * 0.02

    // The billboard type is being changed so the sprite is always facing the camera.
    this.billboardType = "spherical"
  }

  distanceFromCamera() {
    return PIXI3D.Vec3.distance(
      this.worldTransform.position, PIXI3D.Camera.main.worldTransform.position)
  }

  update() {
    this.position.x += this.speedX
    this.position.y = Math.cos(this.speedY += 0.4) * 0.05
    this.position.z += this.speedZ

    if (this.position.x > 5) {
      this.speedX *= -1;
      this.position.x = 5;
    }
    else if (this.position.x < -5) {
      this.speedX *= -1;
      this.position.x = -5;
    }

    if (this.position.z > 5) {
      this.speedZ *= -1;
      this.position.z = 5;
    }
    else if (this.position.z < -5) {
      this.speedZ *= -1;
      this.position.z = -5;
    }
  }
}

const textures = [
  PIXI.Texture.from("assets/bunnies/rabbitv3_ash.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_batman.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_bb8.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_neo.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_sonic.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_spidey.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_stormtrooper.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_superman.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_tron.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_wolverine.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3.png"),
  PIXI.Texture.from("assets/bunnies/rabbitv3_frankenstein.png")
]

const bunnies = []
for (let i = 0; i < 1000; i++) {
  bunnies.push(app.stage.addChild(new Bunny(textures[i % textures.length])))
}

// So the sprites can be sorted using z-index.
app.stage.sortableChildren = true

let control = new PIXI3D.CameraOrbitControl(app.view)
control.angles.x = 5

app.ticker.add(() => {
  for (let bunny of bunnies) {
    bunny.update()
    bunny.zIndex = -bunny.distanceFromCamera()
  }
})