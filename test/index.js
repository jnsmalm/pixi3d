import { use } from "chai"
import * as pixelmatch from "pixelmatch"

use(function (chai) {
  chai.Assertion.addMethod("match", function (expected, { threshold = 0.1 } = {}) {
    const actual = this._obj
    const diff = pixelmatch(actual.data, expected.data, undefined, actual.width, actual.height, { threshold })
    this.assert(
      diff === 0,
      `expected image to match given image, but ${diff} pixels was different, actual: ${actual.url}, expected: ${expected.url}`
    )
  })
})

import "./standard-material.test.js"