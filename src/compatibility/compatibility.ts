import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"
import { CompatibilityVersion } from "./compatibility-version"
import { Version530 } from "./versions/version-530"
import { Version600 } from "./versions/version-600"
import { Version650 } from "./versions/version-650"
import { Version700 } from "./versions/version-700"

export const Compatibility: CompatibilityVersion =
  CompatibilityAccess.get(PixiCore, "VERSION").startsWith("7") ? new Version700() :
    "extensions" in PixiCore ? new Version650() :
      "ArrayResource" in PixiCore ? new Version600() :
        new Version530()