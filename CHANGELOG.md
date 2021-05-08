# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Support for creating a `Cubemap` from colors.
- Support for instancing using `createInstance` on `Mesh3D` or `Model`.
- Simple `Color` class with RGBA components.
- Math functionality (`Vec3`, `Quat`, `Mat4`, `Plane` and `Ray`).
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