
declare module "gl-mat4" {
    
}

declare module "bunny" {
    var positions: any;
    var cells: any;
}

declare module gl.context {
    class GLContext {
        drawingBufferWidth: number;
        drawingBufferHeight: number;
        viewport(top: number, left: number, right: number, bottom: number): void;
        enable(setting: any): void;        

        DEPTH_TEST: any;
        CULL_FACE: any;
        TRIANGLES: any;
    }
}

declare module "gl-context" {   
    function createContext(canvas: any, opts?: any, render?: any): gl.context.GLContext;

    export = createContext;
}

declare module gl.geometry {
    class GLGeometry {
        attr(name: any, attr: any, opts?: any): GLGeometry;
        faces(attr: any, opts?: any): GLGeometry;
        bind(shader: any): void;
        draw(triangles: any): void;
    }
}

declare module "gl-geometry" { 

    function createGeometry(context: gl.context.GLContext): gl.geometry.GLGeometry;

    export = createGeometry

}