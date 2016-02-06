
declare module "gl-mat4" {
    
}

declare module "bunny" {
    var positions: any;
    var cells: any;
}

declare module "gl-context" {
    function createContext(canvas: any, opts?: any, render?: any): any;
    export = createContext;
}