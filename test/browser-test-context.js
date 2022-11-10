import { use } from "chai"
import pixelmatch from "pixelmatch"


class HTMLMessageError extends Error {
  constructor(actualImageUrl, expectedImageUrl) {
    super()
    this.htmlMessage = `
    <div>
      <a href="${actualImageUrl}" target="new">
        <img src="${actualImageUrl}" class="image" />
      </a>
      <a href="${expectedImageUrl}" target="new">
        <img src="${expectedImageUrl}" class="image" />
      </a>
    </div>`
  }
}

use(function (chai) {
  chai.Assertion.addMethod("match", async function (expectedURL, { resources = [], threshold = 0.1, maxDiff = 50 } = {}) {
    resources = resources.map(res => ({ name: res, url: res }))
    let actual = await getImageDataFromRender(this._obj, resources)
    let expected = await getImageDataFromUrl(expectedURL)
    const diff = pixelmatch(actual.data, expected.data,
      undefined, actual.width, actual.height, { threshold })
    if (diff > maxDiff) {
      throw new HTMLMessageError(actual.url, expected.url)
    }
  })
})

import "./punctual-light.test.mjs"
import "./standard-material.test.mjs"
import "./custom-material.test.mjs"
import "./shadow.test.mjs"
import "./instancing.test.mjs"
import "./custom-geometry.test.mjs"
import "./composite-sprite.test.mjs"
import "./sprite.test.mjs"
import "./model-animation.test.mjs"
import "./camera.test.mjs"
import "./camera-orbit-control.test.mjs"
import "./interaction.test.mjs"
import "./skybox.test.mjs"
import "./gltf.test.mjs"
