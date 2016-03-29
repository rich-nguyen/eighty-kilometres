// Our vertex shader is run once for each of these
// vectors, to determine the final position of the vertex
// on the screen and pass data off to the fragment shader.

precision mediump float;

// Our attributes, i.e. the arrays of vectors in the bunny mesh.
attribute vec3 Position;

uniform mat4 u_Persp;
uniform mat4 u_Model;
uniform mat4 u_View;

void main() {

  // - `u_Persp` will apply our perspective matrix, and
  // - `uView` will apply our camera transforms.
  // - `uModel` is unused here, but is traditionally used to
  //   move the object around the scene.
  gl_Position = u_Persp * u_View * u_Model * vec4(Position, 1.0);
}