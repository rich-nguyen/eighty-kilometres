
declare module "gl-mat4" {

    export interface IMatrix {
        /**
         * Must be indexable like an array
         */
        [index: number]: number;
    }

    /**
     * Creates a new identity mat4
     *
     * @returns a new 4x4 matrix
     */
    export function create(): IMatrix;

    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param a matrix to clone
     * @returns a new 4x4 matrix
     */
    export function clone(a: IMatrix): IMatrix;

    /**
     * Copy the values from one mat4 to another
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function copy(out: IMatrix, a: IMatrix): IMatrix;

    /**
     * Set a mat4 to the identity matrix
     *
     * @param out the receiving matrix
     * @returns out
     */
    export function identity(a: IMatrix): IMatrix;

    /**
     * Transpose the values of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function transpose(out: IMatrix, a: IMatrix): IMatrix; 

    /**
     * Inverts a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function invert(out: IMatrix, a: IMatrix): IMatrix;

    /**
     * Calculates the adjugate of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function adjoint(out: IMatrix, a: IMatrix): IMatrix;

    /**
     * Calculates the determinant of a mat4
     *
     * @param a the source matrix
     * @returns determinant of a
     */
    export function determinant(a: IMatrix): number;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function multiply(out: IMatrix, a: IMatrix, b: IMatrix): IMatrix;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function mul(out: IMatrix, a: IMatrix, b: IMatrix): IMatrix;

    /**
     * Translate a mat4 by the given vector
     *
     * @param out the receiving matrix
     * @param a the matrix to translate
     * @param v vector to translate by
     * @returns out
     */
    export function translate(out: IMatrix, a: IMatrix, v: IMatrix): IMatrix;

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param out the receiving matrix
     * @param a the matrix to scale
     * @param v the vec3 to scale the matrix by
     * @returns out
     **/
    export function scale(out: IMatrix, a: IMatrix, v: IMatrix): IMatrix;

    /**
     * Rotates a mat4 by the given angle
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @param axis the axis to rotate around
     * @returns out
     */
    export function rotate(out: IMatrix, a: IMatrix, rad: number, axis: IMatrix): IMatrix;

    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateX(out: IMatrix, a: IMatrix, rad: number): IMatrix;

    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateY(out: IMatrix, a: IMatrix, rad: number): IMatrix;

    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateZ(out: IMatrix, a: IMatrix, rad: number): IMatrix;

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
    export function frustum(out: IMatrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): IMatrix;
    
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
    export function perspective(out: IMatrix, fovy: number, aspect: number,
        near: number, far: number): IMatrix;
    
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
    export function ortho(out: IMatrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): IMatrix;
    
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     *
     * @param out mat4 frustum matrix will be written into
     * @param eye Position of the viewer
     * @param center Point the viewer is looking at
     * @param up vec3 pointing up
     * @returns out
     */
    export function lookAt(out: IMatrix, eye: IMatrix,
        center: IMatrix, up: IMatrix): IMatrix;
    
    /**
     * Returns a string representation of a mat4
     *
     * @param mat matrix to represent as a string
     * @returns string representation of the matrix
     */
    export function str(mat: IMatrix): string;

    /**
     * Returns Frobenius norm of a mat4
     *
     * @param a the matrix to calculate Frobenius norm of
     * @returns Frobenius norm
     */
    export function frob(a: IMatrix): number;

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
    export function fromRotationTranslation(out: IMatrix, q: IMatrix, v: IMatrix): IMatrix;
    
    /**
     * Creates a matrix from a quaternion
     *
     * @param out mat4 receiving operation result
     * @param q Rotation quaternion
     * @returns out
     */
    export function fromQuat(out: IMatrix, q: IMatrix): IMatrix;
}

declare module "bunny" {
    export var positions: any;
    export var cells: any;
}

declare module "gl-context" {

    export class GLContext {
        drawingBufferWidth: number;
        drawingBufferHeight: number;
        viewport(top: number, left: number, right: number, bottom: number): void;
        enable(setting: any): void;

        DEPTH_TEST: any;
        CULL_FACE: any;
        TRIANGLES: any;
    }

    export default function createContext(canvas: any, opts ?: any, render ?: any): GLContext;    
}

declare module "gl-geometry" {

    import { GLContext } from "gl-context";

    export class GLGeometry {
        attr(name: any, attr: any, opts?: any): GLGeometry;
        faces(attr: any, opts?: any): GLGeometry;
        bind(shader: any): void;
        draw(triangles: any): void;
    }

    export default function createGeometry(context: GLContext): GLGeometry;
}