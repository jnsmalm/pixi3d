# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added functionality to create a sphere mesh.
- Added support for vertex colors in standard material.

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