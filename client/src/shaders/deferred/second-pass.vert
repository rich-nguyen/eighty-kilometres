    precision highp float;

    // ID = shade_vs

    attribute vec3 Position;
    attribute vec2 Texcoord;

    varying vec2 fs_Texcoord;
    
    void main() {
        fs_Texcoord = Texcoord * 0.5 + vec2(0.5);
        gl_Position = vec4(Position, 1.0);
    }