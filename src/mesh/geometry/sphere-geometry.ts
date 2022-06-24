import { Vec3 } from "../../math/vec3";
import { MeshGeometry3D } from "./mesh-geometry"

export namespace SphereGeometry {
  export function create(radius = 1, widthSegments = 32, heightSegments = 16, phiStart = 0, phiLength = Math.PI * 2, thetaStart = 0, thetaLength = Math.PI) {

    // based on
    // https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js
    // https://github.com/mrdoob/three.js/blob/dev/LICENSE

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));
    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);
    let index = 0;
    const grid = [];
    const vertex = Vec3.create();
    const normal = Vec3.create();

    // buffers
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    // generate vertices, normals and uvs
    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];
      const v = iy / heightSegments;
      // special case for the poles
      let uOffset = 0;
      if (iy == 0 && thetaStart == 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy == heightSegments && thetaEnd == Math.PI) {
        uOffset = - 0.5 / widthSegments;
      }
      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;
        // vertex
        vertex[0] = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex[1] = radius * Math.cos(thetaStart + v * thetaLength);
        vertex[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertices.push(vertex[0], vertex[1], vertex[2]);
        // normal
        Vec3.normalize(vertex, normal);
        normals.push(normal[0], normal[1], normal[2]);
        // uv
        uvs.push(u + uOffset, 1 - v);
        verticesRow.push(index++);
      }
      grid.push(verticesRow);
    }

    // indices
    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];
        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
      }
    }
    return Object.assign(new MeshGeometry3D(), {
      positions: {
        buffer: new Float32Array(vertices)
      },
      indices: {
        buffer: new Uint16Array(indices)
      },
      normals: {
        buffer: new Float32Array(normals)
      },
      uvs: [{
        buffer: new Float32Array(uvs)
      }]
    })
  }
}