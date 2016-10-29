
declare module "gl-vec3" {

    import { Matrix } from "stackgl"

    export function create(init?: any): any;

    export function set(vec: any, x: number, y: number, z: number): void;

    //transformMat4(out:vec3, a:vec3, m:mat4)
    export function transformMat4(out: any, a: any, m: Matrix): any;

}

declare module "gl-mat4" {

    import { Matrix } from "stackgl"

    /**
     * Creates a new identity mat4
     *
     * @returns a new 4x4 matrix
     */
    export function create(): Matrix;

    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param a matrix to clone
     * @returns a new 4x4 matrix
     */
    export function clone(a: Matrix): Matrix;

    /**
     * Copy the values from one mat4 to another
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function copy(out: Matrix, a: Matrix): Matrix;

    /**
     * Set a mat4 to the identity matrix
     *
     * @param out the receiving matrix
     * @returns out
     */
    export function identity(a: Matrix): Matrix;

    /**
     * Transpose the values of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function transpose(out: Matrix, a: Matrix): Matrix; 

    /**
     * Inverts a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function invert(out: Matrix, a: Matrix): Matrix;

    /**
     * Calculates the adjugate of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function adjoint(out: Matrix, a: Matrix): Matrix;

    /**
     * Calculates the determinant of a mat4
     *
     * @param a the source matrix
     * @returns determinant of a
     */
    export function determinant(a: Matrix): number;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function multiply(out: Matrix, a: Matrix, b: Matrix): Matrix;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function mul(out: Matrix, a: Matrix, b: Matrix): Matrix;

    /**
     * Translate a mat4 by the given vector
     *
     * @param out the receiving matrix
     * @param a the matrix to translate
     * @param v vector to translate by
     * @returns out
     */
    export function translate(out: Matrix, a: Matrix, v: Matrix): Matrix;

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param out the receiving matrix
     * @param a the matrix to scale
     * @param v the vec3 to scale the matrix by
     * @returns out
     **/
    export function scale(out: Matrix, a: Matrix, v: Matrix): Matrix;

    /**
     * Rotates a mat4 by the given angle
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @param axis the axis to rotate around
     * @returns out
     */
    export function rotate(out: Matrix, a: Matrix, rad: number, axis: Matrix): Matrix;

    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateX(out: Matrix, a: Matrix, rad: number): Matrix;

    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateY(out: Matrix, a: Matrix, rad: number): Matrix;

    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateZ(out: Matrix, a: Matrix, rad: number): Matrix;

    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param out mat4 frustum matrix will be written into
     * @param left Left bound of the frustum
     * @param right Right bound of the frustum
     * @param bottom Bottom bound of the frustum
     * @param top Top bound of the frustum
     * @param near Near bound of the frustum
     * @param far Far bound of the frustum
     * @returns out
     */
    export function frustum(out: Matrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): Matrix;
    
    /**
     * Generates a perspective projection matrix with the given bounds
     *
     * @param out mat4 frustum matrix will be written into
     * @param fovy Vertical field of view in radians
     * @param aspect Aspect ratio. typically viewport width/height
     * @param near Near bound of the frustum
     * @param far Far bound of the frustum
     * @returns out
     */
    export function perspective(out: Matrix, fovy: number, aspect: number,
        near: number, far: number): Matrix;
    
    /**
     * Generates a orthogonal projection matrix with the given bounds
     *
     * @param out mat4 frustum matrix will be written into
     * @param left Left bound of the frustum
     * @param right Right bound of the frustum
     * @param bottom Bottom bound of the frustum
     * @param top Top bound of the frustum
     * @param near Near bound of the frustum
     * @param far Far bound of the frustum
     * @returns out
     */
    export function ortho(out: Matrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): Matrix;
    
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     *
     * @param out mat4 frustum matrix will be written into
     * @param eye Position of the viewer
     * @param center Point the viewer is looking at
     * @param up vec3 pointing up
     * @returns out
     */
    export function lookAt(out: Matrix, eye: Matrix,
        center: Matrix, up: Matrix): Matrix;
    
    /**
     * Returns a string representation of a mat4
     *
     * @param mat matrix to represent as a string
     * @returns string representation of the matrix
     */
    export function str(mat: Matrix): string;

    /**
     * Returns Frobenius norm of a mat4
     *
     * @param a the matrix to calculate Frobenius norm of
     * @returns Frobenius norm
     */
    export function frob(a: Matrix): number;

    /**
     * Creates a matrix from a quaternion rotation and vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     var quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *
     * @param out mat4 receiving operation result
     * @param q Rotation quaternion
     * @param v Translation vector
     * @returns out
     */
    export function fromRotationTranslation(out: Matrix, q: Matrix, v: Matrix): Matrix;
    
    /**
     * Creates a matrix from a quaternion
     *
     * @param out mat4 receiving operation result
     * @param q Rotation quaternion
     * @returns out
     */
    export function fromQuat(out: Matrix, q: Matrix): Matrix;
}

declare module "bunny" {
    export var positions: any;
    export var cells: any;
}

declare module "canvas-fit" {
    
    function fit(canvas: Node, parent?: any, scale?: any): any

    export = fit;
}

declare module "canvas-orbit-camera" {

    function attachCamera(canvas: Node, opts?: any): any

    export = attachCamera;
}

declare module "lookat-camera" {

    import {LookAtCamera} from 'stackgl'

    export = LookAtCamera;
}

declare module "stackgl" {

    export interface Matrix {
        /**
         * Must be indexable like an array
         */
        [index: number]: number;
    }

    type Vector3 = [number, number, number];
    type Index3 = [number, number, number];
    type Index4 = [number, number, number, number];
    type UV = [number, number];

    export interface Mesh {

        // The vertex positions, as xyz arrays. Arrays of 3 floats.
        positions: Vector3[];

        // The triangles of the mesh. Indexes refer to positions array. Arrays of 3 index values.
        cells: Index3[];

        // Each cell may have a normal vector. Arrays of 3 index values.
        faceNormals?: Index3[];

        // Each vertex may have a normal vector. Arrays of 3 floats.
        vertexNormals?: Vector3[];

        // Unique UV values. Arrays of 2 UV floats (0 - 1.0).
        vertexUVs?: UV[];

        // The UVs for each face. Indexes refer to vertexUVs array. Arrays of 4 index values.
        faceUVs?: Index4[];
    }

    export type Context = WebGLRenderingContext;    

    export class Geometry {
        attr(name: any, attr: any, opts?: any): Geometry;
        faces(attr: any, opts?: any): Geometry;
        bind(shader: any): void;
        draw(triangles: any): void;
        unbind(): void;

        constructor(context: Context);
    }

    export class LookAtCamera {
        target: number[];
        position: number[];
        up: number[];

        view(view: any): any;
    }

    export class Shader {        
        vertShader: WebGLShader;
        fragShader: WebGLShader;
        program: WebGLProgram;
        attributes: any;
        uniforms: any;

        bind(): void;      
    }

    export class Texture2D {

        handle: WebGLTexture;
        bind(texunit: number): void;
        dispose(): void;

        shape: number[];
        wrap: number[];
        magFilter: number;
        minFilter: number;
        mipSamples: number;
    }
}

declare module "gl-context" {

    import {Context} from 'stackgl'

    function createContext(canvas: any, opts ?: any, render ?: any): Context;    

    export = createContext;
}

declare module "gl-geometry" {

    import {Context, Geometry} from 'stackgl'

    export = Geometry;
}

declare module "parse-wavefront-obj" {

    import {Mesh} from 'stackgl'

    function parse(objContent: string): Mesh
    export = parse;
}

declare module "gl-shader" {

    import {Context, Shader} from 'stackgl'

    function createShader(context: Context, vertexShader: WebGLShader, fragmentShader: WebGLShader): Shader;

    export = createShader;
}

declare module "glslify" {

    function transform(filename: string, browserifyOpts?: any): any;
    export = transform;
}

declare module "gl-texture2d" {

    import {Context, Texture2D} from 'stackgl'

    function createTexture2d(context: Context, width: number, height: number, format?: number, type?: number): Texture2D;
    
    // data could be a HTMLImageElement, HTMLCanvasElement, HTMLVideoElement.
    function createTexture2d(context: Context, data: any): Texture2D;

    export = createTexture2d;
}

declare module "unindex-mesh" {

    function unindex(positions: any, cells: any, out?: any): any;
    export = unindex;
}
