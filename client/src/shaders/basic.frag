precision mediump float;

// Sets the color of the current fragment (pixel)
// to display the normal at the current position.
// Using `abs()` to prevent negative values, which
// would just end up being black.


void main() {
  gl_FragColor = vec4(0.0, 0.8, 0.4, 1.0);
}