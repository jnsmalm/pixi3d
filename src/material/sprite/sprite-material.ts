import { BaseTexture, Renderer, Shader, Texture } from "@pixi/core"
import { Material } from "../material"
import { Camera } from "../../camera/camera"
import { Mesh3D } from "../../mesh/mesh"
import { Color } from "../../color"
import { TextureTransform } from "../../texture/texture-transform"
import { SpriteMaterialFeatureSet } from "./sprite-material-feature-set"
import { InstancedSpriteMaterial } from "./instanced-sprite-material"
import { SpriteMaterialFactory } from "./sprite-material-factory"
import { SpriteShader } from "./sprite-shader"
import { SpriteMeshBillboardType } from "./sprite-mesh-billboard-type"

const shaders: { [features: string]: SpriteShader } = {}

/**
 * The standard material is using Physically-Based Rendering (PBR) which makes 
 * it suitable to represent a wide range of different surfaces. It's the default 
 * material when loading models from file.
 */
export class SpriteMaterial extends Material {
  private mBaseTexture?: BaseTexture;
  private mTexture?: Texture;
  private mBaseColor = new Float32Array([1, 1, 1, 1])
  private mOrigin = new Float32Array([0.5, 0.5, 0.5])
  private mInstancingEnabled = false
  private mBillboardType: SpriteMeshBillboardType = SpriteMeshBillboardType.spherical;

  /** The base color of the material. */
  baseColor = new Color(1, 1, 1, 1)
  private textureTransform: TextureTransform = new TextureTransform();

  private mPixelsPerUnit: number = 100;

  public get billboardType() {
    return this.mBillboardType;
  }

  public set billboardType(value: SpriteMeshBillboardType) {
    if (this.mBillboardType !== value) {
      this.mBillboardType = value;
      this.invalidateShader();
    }
  }

  public get origin() {
    return this.mOrigin;
  }

  public set origin(value: Float32Array) {
    if (this.mOrigin !== value) {
      this.mOrigin = value;
      this.invalidateShader();
    }
  }

  public get pixelsPerUnit() {
    return this.mPixelsPerUnit;
  }

  public set pixelsPerUnit(value: number) {
    if (value <= 0) {
      //bullshit
    }
    if (this.mPixelsPerUnit !== value) {
      this.mPixelsPerUnit = value;
      this.invalidateShader();
    }
  }

  /** The base color texture. */
  get texture() {
    return this.mTexture;
  }

  set texture(value: Texture | undefined) {
    if (value !== this.mTexture && !!value?.baseTexture) {
      this.invalidateShader()
      this.textureTransform = TextureTransform.fromTexture(value);
      this.mBaseTexture = value.baseTexture;
      this.mTexture = value
    }
  }

  /**
   * The camera used when rendering a mesh. If this value is not set, the main 
   * camera will be used by default.
   */
  camera?: Camera;

  destroy() {
    this.mTexture?.destroy();
    this.mBaseTexture?.destroy();
  }

  /**
   * Invalidates the shader so it can be rebuilt with the current features.
   */
  invalidateShader() {
    this._shader = undefined
  }

  /**
   * Creates a new standard material from the specified source.
   * @param source Source from which the material is created.
   */
  static create(source: Texture) {
    return new SpriteMaterialFactory().create(source)
  }

  render(mesh: Mesh3D, renderer: Renderer) {
    if (!this.mInstancingEnabled && mesh.instances.length > 0) {
      // Invalidate shader when instancing was enabled.
      this.invalidateShader()
      this.mInstancingEnabled = mesh.instances.length > 0
    }
    super.render(mesh, renderer)
  }

  get isInstancingSupported() {
    return true
  }

  createInstance() {
    return new InstancedSpriteMaterial(this)
  }

  createShader(mesh: Mesh3D, renderer: Renderer) {
    if (renderer.context.webGLVersion === 1) {
      let extensions = ["EXT_shader_texture_lod", "OES_standard_derivatives"]
      for (let ext of extensions) {
        if (!renderer.gl.getExtension(ext)) {
          // Log warning?
        }
      }
    }
    let features = SpriteMaterialFeatureSet.build(renderer, mesh, mesh.geometry, this)
    if (!features) {
      // The shader features couldn't be built, some resources may still be 
      // loading. Don't worry, we will retry creating shader at next render.
      return undefined
    }
    let checksum = features.join(",")
    if (!shaders[checksum]) {
      shaders[checksum] = SpriteShader.build(renderer, features)
    }
    return shaders[checksum]
  }

  updateUniforms(mesh: Mesh3D, shader: Shader) {
    this.mBaseColor.set(this.baseColor.rgb)
    this.mBaseColor[3] = this.baseColor.a * mesh.worldAlpha
    let camera = this.camera || Camera.main
    //if billboard, we supply the viewprojection matrix differently
    shader.uniforms.u_ViewMatrix = camera.view;
    shader.uniforms.u_ProjectionMatrix = camera.projection;
    shader.uniforms.u_ModelMatrix = mesh.worldTransform.array
    shader.uniforms.u_Color = this.mBaseColor;
    shader.uniforms.u_PixelsPerUnit = this.pixelsPerUnit;
    shader.uniforms.u_Origin = this.origin;
    shader.uniforms.u_Billboard = this.billboardType;
    if (this.mBaseTexture?.valid) {
      shader.uniforms.u_Texture = this.mBaseTexture
      shader.uniforms.u_TexSize = new Float32Array([this.texture?.width || 0, this.texture?.height || 0]);
      shader.uniforms.u_UVTransform = this.textureTransform.array
    }
  }
}