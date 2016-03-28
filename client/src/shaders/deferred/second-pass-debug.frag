// ID = diagnostic_fs

precision highp float;
#define DISPLAY_DEPTH 0
#define DISPLAY_NORMAL 1
#define DISPLAY_POSITION 2
#define DISPLAY_COLOR 3
#define DISPLAY_TOTAL 4
#define DISPLAY_LIGHTS 5

uniform sampler2D u_Depthtex;
uniform sampler2D u_Normaltex;
uniform sampler2D u_Positiontex;
uniform sampler2D u_Colortex; 

uniform int u_DisplayType;
uniform float u_Width;
uniform float u_Height;
uniform vec3 u_Light;  

varying vec2 fs_Texcoord;

void main(void)
{
    vec3 depth = texture2D(u_Depthtex, fs_Texcoord).xyz;
    vec3 normal = normalize(texture2D(u_Normaltex, fs_Texcoord).xyz);
    vec3 position = texture2D(u_Positiontex, fs_Texcoord).xyz;
    vec3 color = texture2D(u_Colortex, fs_Texcoord).xyz;    
    
    vec3 light = u_Light.xyz;//.position.xyz;    
    float diffuse = abs(dot(normal, normalize(light - position)));
    max(dot(normal, normalize(light - position)),0.0);
    
    if(u_DisplayType == DISPLAY_DEPTH)
        gl_FragColor = vec4(depth, 1.0);        
    else if(u_DisplayType == DISPLAY_NORMAL)
        gl_FragColor = vec4(normal, 1.0);
    else if(u_DisplayType == DISPLAY_POSITION)
        gl_FragColor = vec4(abs(position / 500.0), 1.0); // u_far estimate of 500.0
    else if(u_DisplayType == DISPLAY_COLOR){
        gl_FragColor = vec4(color, 1.0);    
    }
    else if(u_DisplayType == DISPLAY_TOTAL)
    {
        if(diffuse == 0.0)
             diffuse = dot(-normal, normalize(light - position));
        gl_FragColor = vec4(diffuse * color , 1.0);                          
    }
    else
        // Pink screen for error.
        gl_FragColor = vec4(vec3(1.0, 0.5, 0.8), 1.0);   
}