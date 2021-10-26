import { use } from "chai"
import * as pixelmatch from "pixelmatch"

use(function (chai) {
  chai.Assertion.addMethod("match", function (expected, { width = 1280, height = 720, threshold = 0.1 } = {}) {
    const actual = this._obj
    const diff = pixelmatch(actual.imageData.data, expected.imageData.data, undefined, width, height, { threshold })
    this.assert(
      diff === 0,
      `expected image to match given image, but ${diff} pixels was different, actual: ${actual.url}, expected: ${expected.url}`
    )
  })
})

import "./standard-material.test.js"