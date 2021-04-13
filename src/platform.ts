import * as PIXI from "pixi.js"

export namespace Platform {
  let _maxVertexUniformVectors: number | undefined

  export function getMaxVertexUniformVectors(renderer: PIXI.Renderer) {
    if (_maxVertexUniformVectors !== undefined) {
      return _maxVertexUniformVectors
    }
    const gl = renderer.gl
    _maxVertexUniformVectors = <number>gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
    return _maxVertexUniformVectors
  }

  let _isFloatTextureSupported: boolean | undefined

  export function isFloatTextureSupported(renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 2) {
      return true
    }
    if (_isFloatTextureSupported !== undefined) {
      return _isFloatTextureSupported
    }
    const gl = renderer.gl
    const ext = gl.getExtension("OES_texture_float")
    if (ext) {
      return true
    }
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 8, 0, gl.RGBA, gl.FLOAT, null)
    _isFloatTextureSupported = gl.getError() === gl.NO_ERROR
    gl.deleteTexture(texture)
    return _isFloatTextureSupported
  }

  let _isHalfFloatFramebufferSupported: boolean | undefined

  export function isHalfFloatFramebufferSupported(renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 2) {
      return true
    }
    if (_isHalfFloatFramebufferSupported !== undefined) {
      return _isHalfFloatFramebufferSupported
    }
    const gl = renderer.gl
    const ext = gl.getExtension("OES_texture_half_float")
    if (!ext) {
      return false
    }
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 8, 0, gl.RGBA, ext.HALF_FLOAT_OES, null)
    const fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0)
    _isHalfFloatFramebufferSupported = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    return _isHalfFloatFramebufferSupported
  }

  let _isFloatFramebufferSupported: boolean | undefined

  export function isFloatFramebufferSupported(renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 2) {
      return true
    }
    if (_isFloatFramebufferSupported !== undefined) {
      return _isFloatFramebufferSupported
    }
    const gl = renderer.gl
    const ext = gl.getExtension("OES_texture_float")
    if (!ext) {
      return false
    }
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 8, 8, 0, gl.RGBA, gl.FLOAT, null)
    const fb = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
    const attachmentPoint = gl.COLOR_ATTACHMENT0
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0)
    _isFloatFramebufferSupported = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    return _isFloatFramebufferSupported
  }

  let _isFloatLinearSupported: boolean | undefined

  export function supportsFloatLinear(renderer: PIXI.Renderer) {
    if (_isFloatLinearSupported !== undefined) {
      return _isFloatLinearSupported
    }
    const gl = renderer.gl
    _isFloatLinearSupported = gl.getExtension("OES_texture_float_linear") !== null
    return _isFloatLinearSupported
  }

  export function isShaderTextureLodSupported(renderer: PIXI.Renderer) {
    if (renderer.context.webGLVersion === 2) {
      return true
    }
    return renderer.gl.getExtension("EXT_shader_texture_lod") !== null
  }
}