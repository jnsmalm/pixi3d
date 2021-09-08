varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

uniform sampler2D uSamplers[%count%];

void main(void){
    vec4 color;
    %forloop%
    gl_FragColor = vColor * vec4(color.rgb, color.a);
}