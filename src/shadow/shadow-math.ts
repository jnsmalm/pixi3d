import { ShadowCastingLight } from "./shadow-casting-light"
import { Mat4 } from "../math/mat4"
import { LightType } from "../lighting/light-type"
import { Vec3 } from "../math/vec3"
import { Quat } from "../math/quat"
import { Camera } from "../camera/camera"

export namespace ShadowMath {

  const _lightProjection = new Float32Array(16)
  const _lightView = new Float32Array(16)
  const _up = new Float32Array([0, 1, 0])
  const _conjugateRotation = new Float32Array(4)
  const _lightSpacePosition = new Float32Array(3)
  const _lightSpaceForward = new Float32Array(3)
  const _cameraTarget = new Float32Array(3)
  const _cameraForward = new Float32Array(3)

  export function calculateDirectionalLightViewProjection(shadowCastingLight: ShadowCastingLight) {
    if (shadowCastingLight.light.type !== LightType.directional) {
      return
    }
    let halfShadowArea = shadowCastingLight.shadowArea / 2
    let worldTexelSize = (halfShadowArea * 2) / shadowCastingLight.shadowArea
    let lightProjection = Mat4.ortho(-halfShadowArea, halfShadowArea,
      -halfShadowArea, halfShadowArea, -halfShadowArea, halfShadowArea, _lightProjection)
    let light = shadowCastingLight.light
    let camera = shadowCastingLight.camera || Camera.main

    if (camera && shadowCastingLight.followCamera) {
      Vec3.scale(camera.worldTransform.forward, halfShadowArea, _cameraForward)
      Vec3.add(camera.worldTransform.position, _cameraForward, _cameraTarget)
      Vec3.transformQuat(_cameraTarget, Quat.conjugate(
        shadowCastingLight.light.worldTransform.rotation, _conjugateRotation), _lightSpacePosition)

      _lightSpacePosition[0] = worldTexelSize *
        Math.floor(_lightSpacePosition[0] / worldTexelSize)
      _lightSpacePosition[1] = worldTexelSize *
        Math.floor(_lightSpacePosition[1] / worldTexelSize)

      Vec3.transformQuat(_lightSpacePosition, light.worldTransform.rotation, _lightSpacePosition)
      Vec3.add(_lightSpacePosition, light.worldTransform.forward, _lightSpaceForward)
      Mat4.lookAt(_lightSpacePosition, _lightSpaceForward, light.worldTransform.up, _lightView)
      Mat4.multiply(lightProjection, _lightView, shadowCastingLight.lightViewProjection)
    } else {
      Vec3.add(light.worldTransform.position,
        shadowCastingLight.light.worldTransform.forward, _cameraTarget)
      Mat4.lookAt(light.worldTransform.position,
        _cameraTarget, light.worldTransform.up, _lightView)
      Mat4.multiply(lightProjection, _lightView, shadowCastingLight.lightViewProjection)
    }
  }

  export function calculateSpotLightViewProjection(shadowCastingLight: ShadowCastingLight) {
    if (shadowCastingLight.light.type !== LightType.spot) {
      return
    }
    let light = shadowCastingLight.light

    Mat4.perspective(light.outerConeAngle * PIXI.DEG_TO_RAD * 2, 1, 2, light.range, _lightProjection)
    Vec3.add(light.worldTransform.position, light.worldTransform.forward, _cameraTarget)
    Mat4.lookAt(light.worldTransform.position, _cameraTarget, light.worldTransform.up, _lightView)
    Mat4.multiply(_lightProjection, _lightView, shadowCastingLight.lightViewProjection)
  }
}