import { use } from "chai"
import * as pixelmatch from "pixelmatch"

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
  chai.Assertion.addMethod("match", function (expected, { threshold = 0.1, maxDiff = 50 } = {}) {
    const actual = this._obj
    const diff = pixelmatch(actual.data, expected.data, undefined, actual.width, actual.height, { threshold })
    if (diff > maxDiff) {
      throw new HTMLMessageError(actual.url, expected.url)
    }
  })
})

import "./punctual-light.test"
import "./standard-material.test"
import "./custom-material.test"
import "./shadow.test"
import "./instancing.test"
import "./custom-geometry.test"
import "./post-processing-sprite.test"
import "./sprite.test"
import "./model-animation.test"
import "./camera.test"
import "./interaction.test"
import "./skybox.test"