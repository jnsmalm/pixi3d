import * as PixiCore from "@pixi/core"

import { CompatibilityVersion } from "./compatibility-version"
import { Version530 } from "./versions/version-530"
import { Version600 } from "./versions/version-600"
import { Version651 as Version650 } from "./versions/version-651"

export const Compatibility: CompatibilityVersion = "extensions" in PixiCore ? new Version650() : "ArrayResource" in PixiCore ? new Version600() : new Version530()