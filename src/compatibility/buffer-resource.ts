import * as PixiCore from "@pixi/core"
import { CompatibilityAccess } from "./compatibility-access"

export const BufferResource: typeof PixiCore.BufferResource =
  CompatibilityAccess.get(PixiCore, "BufferResource") ||
  //@ts-ignore 
  CompatibilityAccess.get(PixiCore, "resources").BufferResource