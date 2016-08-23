#extension GL_EXT_draw_buffers : require

// ID = pass_fs

precision highp float;

//in
varying vec3 fs_Normal;
varying vec2 fs_Texcoord;
varying vec4 fs_Position;
varying float fs_Depth;

uniform sampler2D u_Texture;

void main(void)
{
    //normal, color, position, depth    
    gl_FragData[0] = vec4(normalize(fs_Normal.xyz), 1.0);

    //color    
    gl_FragData[1] = texture2D(u_Texture, vec2(fs_Texcoord.s, fs_Texcoord.t));

    //position
    gl_FragData[2] = vec4(fs_Position.xyz, 1.0);

    //depth    
    gl_FragData[3] = vec4(vec3(fs_Depth), 1.0);    
}