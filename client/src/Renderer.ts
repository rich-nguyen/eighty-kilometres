// The renderer. Draws objects contained in scenes.

/// <reference path="ambient/typings/main.d.ts" />
/// <reference path="ambient/stackgl.d.ts" />

import { Context, Matrix } from 'stackgl'
import { Application } from './app'
import createContext = require('gl-context')
import * as mat4 from 'gl-mat4'

var fit = require('canvas-fit')

export class Renderer {

    public gl: Context;
    private canvas: Node;
    private camera: any;

    constructor() {
        // Creates a canvas element and attaches
        // it to the <body> on your DOM.hello richard, i loveyou x
        this.canvas = document.body.appendChild(document.createElement('canvas'));

        // Creates an instance of canvas-orbit-camera,
        // which later will generate a view matrix and
        // handle interaction for you.
        this.camera = require('canvas-orbit-camera')(this.canvas);

        // A small convenience function for creating
        // a new WebGL context – the `render` function
        // supplied here is called every frame to draw
        // to the screen.
        this.gl = createContext(this.canvas, Application.app.update.bind(Application.app));

        // Resizes the <canvas> to fully fit the window
        // whenever the window is resized.
        window.addEventListener('resize'
            , fit(this.canvas)
            , false
        )
    }

    public render(drawUnits: any): void {

        // Create the base matrices to be used
        // when rendering the bunny. Alternatively, can
        // be created using `new Float32Array(16)`
        var projection: Matrix = mat4.create()
        var model = mat4.create()
        var view = mat4.create()

        var height: any
        var width: any
        // Updates the width/height we use to render the
        // final image.
        width = this.gl.drawingBufferWidth
        height = this.gl.drawingBufferHeight

        // Updates our camera view matrix.
        this.camera.view(view)

        // Optionally, flush the state of the camera. Required
        // for user input to work correctly.
        this.camera.tick()

        // Update our projection matrix. This is the bit that's
        // responsible for taking 3D coordinates and projecting
        // them into 2D screen space.
        var aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight
        var fieldOfView = Math.PI / 4
        var near = 0.01
        var far = 100

        mat4.perspective(projection
            , fieldOfView
            , aspectRatio
            , near
            , far
        )

        // Sets the viewport, i.e. tells WebGL to draw the
        // scene across the full canvas.
        this.gl.viewport(0, 0, width, height)

        // Enables depth testing, which prevents triangles
        // from overlapping.
        this.gl.enable(this.gl.DEPTH_TEST)

        // Enables face culling, which prevents triangles
        // being visible from behind.
        this.gl.enable(this.gl.CULL_FACE)

        // Binds the geometry and sets up the shader's attribute
        // locations accordingly.
        drawUnits.geometry.bind(drawUnits.shader)

        // Updates our model/view/projection matrices, sending them
        // to the GPU as uniform variables that we can use in
        // `shaders/bunny.vert` and `shaders/bunny.frag`.
        drawUnits.shader.uniforms.uProjection = projection
        drawUnits.shader.uniforms.uView = view
        drawUnits.shader.uniforms.uModel = model

        // Finally: draws the bunny to the screen! The rest is
        // handled in our shaders.
        drawUnits.geometry.draw(this.gl.TRIANGLES)
        
    }
    
}

export default Renderer;