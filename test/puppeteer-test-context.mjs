import { PNG } from "pngjs"
import { use } from "chai"
import pixelmatch from "pixelmatch"
import * as puppeteer from "puppeteer"
import express from "express"
import cors from "cors"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const PORT = 3000
const DIRNAME = path.dirname(fileURLToPath(import.meta.url))

use(function (chai) {
  chai.Assertion.addMethod("match", async function (expectedURL, { resources = [], threshold = 0.1, maxDiff = 50 } = {}) {
    resources = resources.map(res => ({
      name: res,
      url: `http://localhost:${PORT}/${res}`
    }))
    let actual = await getImageDataFromRender(this._obj, resources)
    let expected = await getImageDataFromSnapshot("test/" + expectedURL)
    const diff = pixelmatch(actual.data, expected.data,
      undefined, actual.width, actual.height, { threshold })
    if (diff > maxDiff) {
      // await fs.writeFile("./temp.png", PNG.sync.write(actual))
      throw new Error(`The render didn't match the snapshot (diff ${diff} > maxDiff ${maxDiff})`)
    }
  })
})

let app, server, browser, page

before(async function () {
  app = express()
  app.use(cors())
  app.use("/assets", express.static(path.join(DIRNAME, "assets")))
  server = app.listen(PORT, () => { })
  browser = await puppeteer.launch({ headless: true })
})

beforeEach(async function () {
  page = await browser.newPage()

  await page.addScriptTag({ url: "https://pixijs.download/v6.4.2/pixi.js" })
  await page.addScriptTag({ path: "./dist/umd/pixi3d.js" })
  await page.addScriptTag({ path: path.join(DIRNAME, "test-utils.js") })
})

afterEach(async function() {
  await page.close()
})

after(async function () {
  server.close(); await browser.close()
});

async function getImageDataFromRender(render, resources) {
  let renderFuncString = render.toString()
    .slice(render.toString()
      .indexOf("{") + 1, render.toString()
        .lastIndexOf("}"))

  let url = await page.evaluate((renderFuncString, resources) => {
    // This function is running inside puppeteer browser
    return getObjectURLFromRender(new Function(
      "renderer", "resources", renderFuncString), resources)
  }, renderFuncString, resources)

  const response = await page.goto(url)
  let data = await response.buffer()
  return new Promise(resolve => {
    let png = new PNG().parse(data, function (error, data) {
      resolve(png)
    })
  })
}

async function getImageDataFromSnapshot(path) {
  let data = await fs.readFile(path)
  return new Promise(resolve => {
    let png = new PNG().parse(data, function (error, data) {
      resolve(png)
    })
  })
}

import "./punctual-light.test.mjs"
import "./standard-material.test.mjs"
import "./custom-material.test.mjs"
import "./shadow.test.mjs"
import "./instancing.test.mjs"
import "./custom-geometry.test.mjs"
import "./post-processing-sprite.test.mjs"
import "./sprite.test.mjs"
import "./model-animation.test.mjs"
import "./camera.test.mjs"
import "./camera-orbit-control.test.mjs"
// import "./interaction.test"
import "./skybox.test.mjs"
import "./gltf.test.mjs"
