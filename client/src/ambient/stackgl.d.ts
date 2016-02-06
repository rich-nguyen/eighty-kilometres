
declare module "gl-mat4" {
    
}

declare module "bunny" {
    var positions: any;
    var cells: any;
}

declare module "gl-context" {
    function createContext(...args: any[]): any;
    export = createContext;
}