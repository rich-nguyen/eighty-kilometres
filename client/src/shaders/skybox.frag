#define SHADER_NAME skybox.frag

precision highp float;

uniform samplerCube uTexture;

varying vec3 vNorm;

void main() {
    //gl_FragColor = textureCube(uTexture, vNorm);
    gl_FragColor = vec4(0.3, 0.5, 0.8, 1.0);
}
