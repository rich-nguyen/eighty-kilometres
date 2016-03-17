precision highp float;

// ID = pass_vs

uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Persp;
uniform mat4 u_InvTrans;

attribute vec3 Position;
attribute vec3 Normal;
attribute vec2 Texcoord;

varying vec3 fs_Normal;
varying vec4 fs_Position;
varying vec2 fs_Texcoord;
varying float fs_Depth;

void main(void) {
    fs_Normal = ((u_InvTrans*vec4(Normal,0.0)).xyz);
    vec4 world = u_Model * vec4(Position, 1.0);
    vec4 camera = u_View * world;
    fs_Position = camera;
    gl_Position = u_Persp * camera;
    fs_Texcoord = Texcoord;
    fs_Depth = ((gl_Position.z / gl_Position.w));
}