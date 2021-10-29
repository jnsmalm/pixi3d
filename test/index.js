import { use } from "chai"
import * as pixelmatch from "pixelmatch"

use(function (chai) {
  chai.Assertion.addMethod("match", function (expected, { threshold = 0.1 } = {}) {
    const actual = this._obj
    const diff = pixelmatch(actual.data, expected.data, undefined, actual.width, actual.height, { threshold })
    this.assert(
      diff <= 5,
      `expected image to match given image, but ${diff} pixels was different, actual: ${actual.url}, expected: ${expected.url}`
    )
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