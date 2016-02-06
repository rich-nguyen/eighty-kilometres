
declare namespace gl {
    interface IMatrix {
        /**
         * Must be indexable like an array
         */
        [index: number]: number;
    }

}
declare module "gl-mat4" {
    /**
     * Creates a new identity mat4
     *
     * @returns a new 4x4 matrix
     */
    export function create(): gl.IMatrix;

    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param a matrix to clone
     * @returns a new 4x4 matrix
     */
    export function clone(a: gl.IMatrix): gl.IMatrix;

    /**
     * Copy the values from one mat4 to another
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function copy(out: gl.IMatrix, a: gl.IMatrix): gl.IMatrix;

    /**
     * Set a mat4 to the identity matrix
     *
     * @param out the receiving matrix
     * @returns out
     */
    export function identity(a: gl.IMatrix): gl.IMatrix;

    /**
     * Transpose the values of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function transpose(out: gl.IMatrix, a: gl.IMatrix): gl.IMatrix; 

    /**
     * Inverts a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function invert(out: gl.IMatrix, a: gl.IMatrix): gl.IMatrix;

    /**
     * Calculates the adjugate of a mat4
     *
     * @param out the receiving matrix
     * @param a the source matrix
     * @returns out
     */
    export function adjoint(out: gl.IMatrix, a: gl.IMatrix): gl.IMatrix;

    /**
     * Calculates the determinant of a mat4
     *
     * @param a the source matrix
     * @returns determinant of a
     */
    export function determinant(a: gl.IMatrix): number;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function multiply(out: gl.IMatrix, a: gl.IMatrix, b: gl.IMatrix): gl.IMatrix;

    /**
     * Multiplies two mat4's
     *
     * @param out the receiving matrix
     * @param a the first operand
     * @param b the second operand
     * @returns out
     */
    export function mul(out: gl.IMatrix, a: gl.IMatrix, b: gl.IMatrix): gl.IMatrix;

    /**
     * Translate a mat4 by the given vector
     *
     * @param out the receiving matrix
     * @param a the matrix to translate
     * @param v vector to translate by
     * @returns out
     */
    export function translate(out: gl.IMatrix, a: gl.IMatrix, v: gl.IMatrix): gl.IMatrix;

    /**
     * Scales the mat4 by the dimensions in the given vec3
     *
     * @param out the receiving matrix
     * @param a the matrix to scale
     * @param v the vec3 to scale the matrix by
     * @returns out
     **/
    export function scale(out: gl.IMatrix, a: gl.IMatrix, v: gl.IMatrix): gl.IMatrix;

    /**
     * Rotates a mat4 by the given angle
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @param axis the axis to rotate around
     * @returns out
     */
    export function rotate(out: gl.IMatrix, a: gl.IMatrix, rad: number, axis: gl.IMatrix): gl.IMatrix;

    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateX(out: gl.IMatrix, a: gl.IMatrix, rad: number): gl.IMatrix;

    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateY(out: gl.IMatrix, a: gl.IMatrix, rad: number): gl.IMatrix;

    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param out the receiving matrix
     * @param a the matrix to rotate
     * @param rad the angle to rotate the matrix by
     * @returns out
     */
    export function rotateZ(out: gl.IMatrix, a: gl.IMatrix, rad: number): gl.IMatrix;

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
    export function frustum(out: gl.IMatrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): gl.IMatrix;
    
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
    export function perspective(out: gl.IMatrix, fovy: number, aspect: number,
        near: number, far: number): gl.IMatrix;
    
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
    export function ortho(out: gl.IMatrix, left: number, right: number,
        bottom: number, top: number, near: number, far: number): gl.IMatrix;
    
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     *
     * @param out mat4 frustum matrix will be written into
     * @param eye Position of the viewer
     * @param center Point the viewer is looking at
     * @param up vec3 pointing up
     * @returns out
     */
    export function lookAt(out: gl.IMatrix, eye: gl.IMatrix,
        center: gl.IMatrix, up: gl.IMatrix): gl.IMatrix;
    
    /**
     * Returns a string representation of a mat4
     *
     * @param mat matrix to represent as a string
     * @returns string representation of the matrix
     */
    export function str(mat: gl.IMatrix): string;

    /**
     * Returns Frobenius norm of a mat4
     *
     * @param a the matrix to calculate Frobenius norm of
     * @returns Frobenius norm
     */
    export function frob(a: gl.IMatrix): number;

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
    export function fromRotationTranslation(out: gl.IMatrix, q: gl.IMatrix,
        v: gl.IMatrix): gl.IMatrix;
    
    /**
     * Creates a matrix from a quaternion
     *
     * @param out mat4 receiving operation result
     * @param q Rotation quaternion
     * @returns out
     */
    export function fromQuat(out: gl.IMatrix, q: gl.IMatrix): gl.IMatrix;
}

declare module "bunny" {
    export var positions: any;
    export var cells: any;
}

declare namespace gl {
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

    function createContext(canvas: any, opts?: any, render?: any): gl.GLContext;

    export default createContext;
}

declare namespace gl {
    class GLGeometry {
        attr(name: any, attr: any, opts?: any): GLGeometry;
        faces(attr: any, opts?: any): GLGeometry;
        bind(shader: any): void;
        draw(triangles: any): void;
    }
}

declare module "gl-geometry" { 

    function createGeometry(context: gl.GLContext): gl.GLGeometry;

    export default createGeometry

}