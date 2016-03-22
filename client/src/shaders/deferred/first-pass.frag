#extension GL_EXT_draw_buffers : require

// ID = pass_fs

precision highp float;
//uniform vec3 u_Color;
//uniform sampler2D u_ColorSampler;

//in
varying vec3 fs_Normal;
//varying vec2 fs_Texcoord;
varying vec4 fs_Position;
varying float fs_Depth;

//uniform sampler2D u_Texutre;

void main(void)
{
    //normal, color, position, depth
    
    gl_FragData[0] = vec4(normalize(fs_Normal.xyz), 1.0);
    gl_FragData[1] = vec4(0.5, 0.5, 0.5, 1.0);    //vec4(texture2D(u_Texutre, fs_Texcoord).xyz, 1.0);
    gl_FragData[2] = fs_Position;
    gl_FragData[3] = vec4(vec3(fs_Depth), 1.0);
   
    //gl_FragData[1] = vec4(u_Color.x, u_Color.y, u_Color.z, 1.0);    
}