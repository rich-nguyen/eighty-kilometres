precision highp float;

// ID = pass_vs

uniform mat4 u_Model;
uniform mat4 u_View;
uniform mat4 u_Persp;
uniform mat4 u_InvTrans;

uniform float u_Far;
uniform float u_Near;

attribute vec3 Position;
attribute vec3 Normal;
attribute vec2 Texcoord;

varying vec3 fs_Normal;
varying vec4 fs_Position;
varying vec2 fs_Texcoord;
varying float fs_Depth;

float linearizeDepth(float exp_depth, float near, float far) {
    return  (2.0 * near) / (far + near -  exp_depth * (far - near)); 
}

void main(void) {
    fs_Normal = ((u_InvTrans * vec4(Normal, 0.0)).xyz);
    vec4 camera = u_View * u_Model * vec4(Position, 1.0);
    
    gl_Position = u_Persp * camera;

    fs_Texcoord = Texcoord;
    fs_Position = camera;

    fs_Depth = linearizeDepth(gl_Position.z / gl_Position.w, u_Near, u_Far);     
}