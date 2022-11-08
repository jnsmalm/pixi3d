import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"
import { CompatibilityVersion } from "./compatibility-version"
import { Version530 } from "./versions/version-530"
import { Version600 } from "./versions/version-600"
import { Version650 } from "./versions/version-650"
import { Version700 } from "./versions/version-700"

const isPixi700 = "VERSION" in PixiCore &&
  CompatibilityAccess.get(PixiCore, "VERSION").startsWith("7")
const isPixi650 = "extensions" in PixiCore
const isPixi600 = "ArrayResource" in PixiCore

export const Compatibility: CompatibilityVersion =
  isPixi700 ? new Version700() :
    isPixi650 ? new Version650() :
      isPixi600 ? new Version600() :
        new Version530()