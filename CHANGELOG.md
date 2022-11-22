# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2022-11-22
### Added
- Added support for HDR cubemaps when using `ImageBasedLighting` or `Skybox` (encoded using the RGBE8 format).
- Added support for changing the exposure of a `Skybox`.
- `Skybox` is now rendered with gamma correction.
- Added request options to `glTFAsset.fromURL`.

## [2.0.1] - 2022-11-12
### Fixed
- Fixed an issue which caused a crash when rendering shadows with skinned meshes.

## [2.0.0] - 2022-11-12
### Added
- Added support for PixiJS v7 and new method of loading assets. If you are using PixiJS v7+ and npm, import from *pixi3d/pixi7* i.e. `import { Model } from "pixi3d/pixi7"`.
- Added several math functions to `Point3D`.
- Added several math functions to `Quaternion`.
- Added `glTFAsset.fromURL`, an async function to load a glTF file. Only works when using PixiJS v7+.
- Added support to render shadows when using instancing.

### Changed
- No longer transpiled to ES5, if you need these targets (e.g. IE 11) you'll need to transpile yourself with Babel or other tools capable of porting to ES5.
- Renamed `PostProcessingSprite` to `CompositeSprite`.
- Renamed `ObservablePoint3D` to `Point3D` and changed order of constructor arguments.
- Renamed `ObservableQuaternion` to `Quaternion` and changed order of constructor arguments.
- Renamed `Matrix4` to `Matrix4x4`.
- Constructor arguments was changed for `PickingHitArea`.
- `Camera` properties `view`, `projection` and `viewProjection` was changed from `Float32Array` to `Matrix4x4`.
- Many `Matrix4x4` properties was changed from `Float32Array` to either `Point3D` or `Quaternion`.
- `Plane.normal` was changed from `Float32Array` to `Point3D`.
- `Ray.direction` was changed from `Float32Array` to `Point3D`.
- `Ray.origin` was changed from `Float32Array` to `Point3D`.
- `ProjectionSprite.modelViewProjection` was changed from `Float32Array` to `Matrix4x4`.

### Removed
- `PickingHitArea.fromObject` was removed, use regular constructor instead.
- `StandardPipeline.createPostProcessingSprite` was removed, use `CompositeSprite` instead.

## [1.6.2] - 2022-08-28
### Fixed
- Fixed an issue which caused a crash when all invisible instances was destroyed.

## [1.6.1] - 2022-08-19
### Fixed
- Fixed an issue which caused glTF loading function to return before all resources was loaded.

## [1.6.0] - 2022-08-14
### Added
- Added support for PixiJS extensions API.
- Added `Vec3.lerp`.

### Fixed
- Fixed an issue which could cause instanced meshes to not render correctly after changing visibility for those objects.
- Fixed an issue which caused glTF embedded images to not load correctly.

### Changed
- The default value for `alphaMode` on `StandardMaterial` was changed to `blend` to make it easier to render transparent objects without having to change `alphaMode`. To get the previous behavior, set `alphaMode` to `opaque`.
- `Sprite3D` objects are now rendered after all meshes to fix draw order issues.
- `Sprite3D` objects are now rendered from back to front by default.

## [1.5.1] - 2022-07-26
### Fixed
- Removed peer dependencies from `package.json` which could cause issues with multiple PixiJS versions when using bundlers.

## [1.5.0] - 2022-07-23
### Added
- Added `Mesh3D.createSphere` function for creating a sphere mesh.
- Added support for vertex colors.
- Added `Material.from` function to be able to create a custom material without the need of extending from `Material`.

### Fixed
- Fixed an issue which caused picking interaction to not function correctly when resolution was any other value than 1.
- Fixed an issue which caused `Skybox` to not render correctly when using PixiJS v6+.
- Fixed sorting of meshes when using values less than 0.
- Fixed warning when using `PostProcessingSprite` with PixiJS v6+.

### Changed
- Skybox will now be rendered before other meshes by default.

## [1.4.1] - 2022-06-14
### Fixed
- Fixed an issue which caused camera orbit control not to function correctly in Firefox.

## [1.4.0] - 2022-05-01
### Added
- Added a static function to create a `PickingHitArea` without the need to pass a renderer.

## [1.3.1] - 2022-03-18
### Fixed
- Fixed an issue which caused skinning to work incorrectly when PIXI.settings.RESOLUTION = 2.

## [1.3.0] - 2022-03-09
### Added
- Added a function to set resolution for `PostProcessingSprite`.

### Fixed
- Fixed an issue which caused `StandardMaterial` to set incorrect transforms on some textures.

## [1.2.1] - 2022-02-11
### Fixed
- Fixed an issue which caused some glTF materials to not load correctly.
- Fixed an issue which caused `PostProcessingSprite` resolution to not be set.

## [1.2.0] - 2022-02-04
### Added
- Added `AABB` (axis-aligned bounding box).
- Added support for calculating the bounding box (AABB) for a model and mesh.

### Fixed
- Fixed an issue which caused some glTF files to not load correctly when byte stride was set.

## [1.1.2] - 2022-01-07
### Fixed
- Fixed an issue which caused some binary glTF files (glb) to not load correctly.

## [1.1.1] - 2021-11-30
### Fixed
- Fixed an issue which caused `PostProcessingSprite` to crash if application/renderer was destroyed.

## [1.1.0] - 2021-11-20
### Added
- Added support to use textures included in spritesheets when using `StandardMaterial`.
- Added support for camera obliqueness.

## [1.0.0] - 2021-11-01
### Added
- Debug object which can be used to more easily debug on mobile devices.

### Changed
- Vertex skinning now uses textures for joint matrices as default.
- Better error handling when vertex skinning is not supported on device/environment.
- Use lower case for `SpriteBillboardType` "spherical" and "cylindrical".

### Fixed
- Fixed an issue which caused shadows to be displayed incorrectly when using multiple lights.
- Fixed an issue which caused a crash if application/renderer was destroyed.

## [0.9.9] - 2021-09-30
### Added
- Added `Sprite3D` which works like regular PixiJS 2D sprites but in 3D space.
- Improved support for glTF.
- Added `fromHex` function to `Color`.
- Added `TextureTransform` which can used to offset, scale and rotate texture coordinates.
- Added `min` and `max` values for mesh geometry attributes to be able to create bounds for a mesh.
- Meshes rendered using `StandardPipeline` is now sorted by `renderSortOrder`.

### Changed
- Removed `setFromMultiply` from `TransformMatrix`, use `multiply` function instead.
- Removed `factory` from `StandardMaterial`, use `create` function instead.
- Removed `addRenderPass` and `removeRenderPass` from `StandardPipeline`, use `renderPasses` array instead.
- `Joint` now extends `Container3D`.
- Removed ambient lights, use `ImageBasedLighting` with `Cubemap.fromColor` instead.
- Renamed `TransformMatrix` to `Matrix4`.
- Renamed `morphWeights` to `targetWeights` on `Mesh3D`.
- Setting `renderSortType` on `Material` no longer changes `depthMask`.
- Default exposure for `StandardMaterial` was changed from 3 to 1.
- Changed `enabledRenderPasses` on `Mesh3D` to an object instead of an array.
- Changed the constructor for `ShadowCastingLight` to use an options object. Arguments `softness` and `shadowArea` was added as properties instead.

### Fixed
- Fixed issues which caused `Camera`, `PostProcessingSprite` and `PickingHitArea` to not work correctly when renderer resolution was more than 1.
- Fixed an issue which caused `screenToRay` on `Camera` to return incorrect results when `orthographic = true`.
- Fixed orientation for default IBL lookup texture.

## [0.9.8] - 2021-08-23
### Added
- Added `scale` function to `Mat4`.

### Changed
- Setting `alphaMode` on `StandardMaterial` no longer changes `depthMask` or `renderSortType`.
- Setting `renderSortType` on `Material` also changes `depthMask`.

### Fixed
- Fixed an issue which caused a crash when application was destroyed.

## [0.9.7] - 2021-08-11
### Added
- New functionality to `PostProcessingSprite` so it can be used for rendering a 3D object as a 2D sprite.
- Added `translate` function to `Mat4`.
- Added `lookAt` function to `Transform3D` to make it easier for an object to be rotated towards a specified point.

## [0.9.6] - 2021-07-28
### Added
- Added `destroy` function to an instanced model.
- Added functionality to create a `Color` object from bytes.

### Changed
- Turn off writing to depth buffer when rendering transparent objects using `StandardMaterial`. This feature if only available in PixiJS 6.0+.
- `Color` default alpha has been changed to 1 instead of 0.

### Fixed
- Fixed an issue which caused mesh instances to be rendered even if they were `visible = false`.
- Fixed an issue which caused `StandardMaterial` not to render double sided materials correctly.
- Using `StandardMaterial` alpha mode "mask" previously rendered the object as transparent, this should no longer be the case.
- Fixed `StandardMaterial` shader for Safari with WebGL 2.0 enabled.

## [0.9.5] - 2021-05-09
### Fixed
- Fixed an issue which caused WebGL errors when using instancing.

## [0.9.4] - 2021-05-08
### Added
- Support for creating a `Cubemap` from colors.
- Support for instancing using `createInstance` on `Mesh3D` or `Model`.
- Simple `Color` class with RGBA components.
- Math functionality: `Vec3`, `Quat`, `Mat4`, `Plane` and `Ray`.
- Support for loading binary glTF (.glb) files.
- Additional components for `TransformMatrix`.
- Convert screen coordinates to a `Ray` using `Camera`.
- Enable/disable render passes on `Mesh3D`.

### Changed
- Renamed `texture` to `cubemap` on a resource loaded from a cubemap file.
- Renamed `CubeMipmapTexture` to `Cubemap`.
- Renamed `renderType` to `renderSortType` on `Material`.
- Renamed `renderPasses` to `enabledRenderPasses` on `Mesh3D`.
- Renamed `texture` to `cubemap` on `Skybox`.
- Use `Color` instead of array on `StandardMaterial`, `MaterialRenderPass` and `Light`.
- Renamed `CubeMipmapResource` to `CubemapResource`.
- `Skybox.from` takes an object as an argument instead of a string.
- Renamed `setFromMultiplyWorldLocal` to `setFromMultiply` on `TransformMatrix`.

### Removed
- `Cubemap.fromSource` was removed, use `Cubemap.fromFaces` instead.
- `TransformMatrix` `target` property was removed, use math functionality instead.

### Fixed
- Fixed loading of glTF assets pointing to same resources.
- Honor `stopped` interactions for `CameraOrbitControl`.