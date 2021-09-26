# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added `Sprite3D` which works like regular PixiJS 2D sprites but in 3D space.
- Improved support for glTF.
- Added `fromHex` function to `Color`.
- Added `TextureTransform` which can used to offset, scale and rotate texture coordinates.
- Added `min` and `max` values for mesh geometry attributes.
- Meshes rendered using `StandardPipeline` is now sorted by `renderSortOrder`.

### Changed
- Renamed `morphWeights` to `targetWeights` for `Mesh3D`.
- Removed `setFromMultiply` from `TransformMatrix`, use `multiply` function instead.
- Renamed `TransformMatrix` to `Matrix4`.
- Setting `renderSortType` on `Material` no longer changes `depthMask`.
- Removed `addRenderPass` and `removeRenderPass` from `StandardPipeline`, use `renderPasses` array instead.
- `Joint` now extends `Container3D`.
- Default exposure for `StandardMaterial` was changed from 3 to 1.

### Fixed
- Fixed issues which caused `Camera`, `PostProcessingSprite` and `PickingHitArea` to not work correctly when renderer resolution was more than 1.
- Fixed an issue which caused `screenToRay` on `Camera` to return incorrect results when `orthographic = true`
- Fixed orientation for default IBL lookup texture.

## [0.9.8] - 2021-09-23
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