// The renderer. Draws objects contained in scenes.
// Deferred rendering system based on:
// https://hacks.mozilla.org/2014/01/webgl-deferred-shading
// https://github.com/YuqinShao/Tile_Based_WebGL_DeferredShader

/// <reference path="ambient/typings/main.d.ts" />
/// <reference path="ambient/stackgl.d.ts" />

import { Context, Matrix, Shader, Texture2D } from 'stackgl'
import { Application } from './app'
import createContext = require('gl-context')
import * as mat4 from 'gl-mat4'
import * as vec3 from 'gl-vec3'
import fit = require('canvas-fit')

import glslify = require('glslify')
import glShader = require('gl-shader')

import LookAtCamera = require('lookat-camera')
import orbitCamera = require('canvas-orbit-camera')

import Geometry = require('gl-geometry')
import createTexture = require('gl-texture2d')

var pip = require('gl-texture2d-pip')

export interface DrawUnit {
    geometry: any
    texture: Texture2D
    shader: Shader
}

export enum DisplayType {
    Depth,
    Normal,
    Position,
    Color,
    Total
}

export class Renderer {

    public gl: Context;
    private canvas: HTMLCanvasElement;
    private frameBuffer: WebGLFramebuffer;

    private pass_prog: Shader;
    private diagnostic_prog: Shader;

    private diagnosticLocs: WebGLUniformLocation[];
    private diagnosticLoc_Light: WebGLUniformLocation;
    
    private quad_positionLocation: number;
    private quad_texCoordLocation: number;
    private positionLocation: number;
    private normalLocation: number;
    private texCoordLocation: number;

    private u_ModelLocation: WebGLUniformLocation;
    private u_ViewLocation: WebGLUniformLocation;
    private u_PerspLocation: WebGLUniformLocation;
    private u_InvTransLocation: WebGLUniformLocation;
    private u_ColorSamplerLocation: WebGLUniformLocation;   

    private display_type: DisplayType;

    private normalTexture: Texture2D;
    private colorTexture: Texture2D;
    private positionTexture: Texture2D;
    private depthRGBTexture: Texture2D;
    private depthTexture: Texture2D;  

    private lookAtCamera: LookAtCamera;
    private orbitCamera: any;

    private device_quad: any;
    private vbo_vertices: any;
    private vbo_indices: any;
    private vbo_textures: any;

    private ext: any;

    private canvasClientWidth: number;
    private canvasClientHeight: number;

    constructor() {

        // Creates a canvas element and attaches
        // it to the <body> on your DOM.hello richard, i loveyou x
        this.canvas = <HTMLCanvasElement>document.querySelector(".primary-canvas");

        // Creates an instance of look-at camera and orbit camera.
        this.lookAtCamera = new LookAtCamera();
        this.orbitCamera = orbitCamera(this.canvas);      

        // A small convenience function for creating
        // a new WebGL context – the `render` function
        // supplied here is called every frame to draw
        // to the screen.
        this.gl = createContext(this.canvas, Application.app.update);

        this.ext = this.gl.getExtension('WEBGL_draw_buffers');
        if (!this.ext) {
            console.log("Draw Buffers are not supported in this browser.");
        }
        
        var extDepth = this.gl.getExtension("WEBGL_depth_texture");

        if (!extDepth) {
            console.log("Extension Depth texture is not supported in this browser.");       
        }

        // Resizes the <canvas> to fully fit the window
        // whenever the window is resized.
        window.addEventListener('resize', () => {
            if (this.canvasClientHeight !== this.canvas.clientHeight &&
                this.canvasClientWidth !== this.canvas.clientWidth ) {

                this.canvasClientWidth = this.canvas.clientWidth;
                this.canvasClientHeight = this.canvas.clientHeight;
            
                this.canvas.height = this.canvasClientHeight;
                this.canvas.width = this.canvasClientWidth;

                this.setupFrameBufferTextures();

                //http://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
                //gl.clearRect
            }
        });

        this.canvasClientWidth = this.canvas.clientWidth;
        this.canvasClientHeight = this.canvas.clientHeight;
        // Now set the canvas to be upscaled.
        this.canvas.height = this.canvasClientHeight;
        this.canvas.width = this.canvasClientWidth;

        // TODO: Some styling will be needed to maintain aspect ratio.


        this.gl.getExtension("OES_texture_float");
        this.gl.getExtension("OES_half_float_linear");
        this.gl.getExtension("OES_texture_float_linear");
        
        

        // Create and bind framebuffer object.
        this.frameBuffer = this.gl.createFramebuffer();       
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);      


        // The drawBuffersWEBGL extension allows us to define the draw buffers to which fragment colors will be written.
        // The fragment shader will write to the buffers using gl_FragData.
        this.ext.drawBuffersWEBGL([
            this.ext.COLOR_ATTACHMENT0_WEBGL, // gl_FragData[0] Normal
            this.ext.COLOR_ATTACHMENT1_WEBGL, // gl_FragData[1] Color
            this.ext.COLOR_ATTACHMENT2_WEBGL, // gl_FragData[2] Position
            this.ext.COLOR_ATTACHMENT3_WEBGL  // gl_FragData[3] Depth
        ]);

        this.setupFrameBufferTextures();

        //programs:
        // 1. pass_prog
        // 2. one of: ambient_prog | light_prog | nontilelight_prog | diagnostic_prog

        // Interpreted.
        this.pass_prog = glShader(this.gl,
            glslify('./shaders/deferred/first-pass.vert'),
            glslify('./shaders/deferred/first-pass.frag')
        );


        this.diagnostic_prog = glShader(this.gl,
            glslify('./shaders/deferred/second-pass.vert'),
            glslify('./shaders/deferred/second-pass-debug.frag')
        );

        this.diagnosticLocs = [];
        
        this.quad_positionLocation = 0;
        this.quad_texCoordLocation = 1;
        
        var positions = new Float32Array([
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0
        ]);

        var textures = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ]);

        this.device_quad = { num_indices: 0 };
        var indices = [0, 1, 2, 0, 2, 3];
        this.device_quad.num_indices = 6;

        this.vbo_vertices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_vertices);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        this.vbo_textures = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_textures);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textures), this.gl.STATIC_DRAW);

        this.vbo_indices = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_indices);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);        
        
        this.display_type = DisplayType.Total;
    }

    private setupFrameBufferTextures(): void {

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

        // Defaults to magFilter/minFilter = NEAREST, wrap = CLAMP_TO_EDGE.
        if (this.depthTexture) {
            this.depthTexture.dispose();
        }
        this.depthTexture = createTexture(this.gl, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT);

        if (this.depthRGBTexture) {
            this.depthRGBTexture.dispose();
        }
        this.depthRGBTexture = createTexture(this.gl, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.FLOAT);
        this.depthRGBTexture.magFilter = this.gl.LINEAR;
        this.depthRGBTexture.minFilter = this.gl.LINEAR;

        if (this.normalTexture) {
            this.normalTexture.dispose();
        }
        this.normalTexture = createTexture(this.gl, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.FLOAT);
        this.normalTexture.magFilter = this.gl.LINEAR;
        this.normalTexture.minFilter = this.gl.LINEAR;

        if (this.positionTexture) {
            this.positionTexture.dispose();
        }
        this.positionTexture = createTexture(this.gl, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.FLOAT);
        this.positionTexture.magFilter = this.gl.LINEAR;
        this.positionTexture.minFilter = this.gl.LINEAR;

        if (this.colorTexture) {
            this.colorTexture.dispose();
        }
        this.colorTexture = createTexture(this.gl, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, this.gl.RGBA, this.gl.FLOAT);
        this.colorTexture.magFilter = this.gl.LINEAR;
        this.colorTexture.minFilter = this.gl.LINEAR;

        // Setup deferred shading by attaching textures to different frame buffer color attachments.
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT0_WEBGL, this.gl.TEXTURE_2D, this.normalTexture.handle, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT1_WEBGL, this.gl.TEXTURE_2D, this.colorTexture.handle, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT2_WEBGL, this.gl.TEXTURE_2D, this.positionTexture.handle, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.ext.COLOR_ATTACHMENT3_WEBGL, this.gl.TEXTURE_2D, this.depthRGBTexture.handle, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.handle, 0);
        

        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
            // Can't use framebuffer.
            // See http://www.khronos.org/opengles/sdk/docs/man/xhtml/glCheckFramebufferStatus.xml
            console.log("Frame buffer initialisation failed");
        } else {
            console.log("Frame buffer initialisation success");
        }
    }

    public render(drawUnits: DrawUnit[]): void {        

        // Create the base matrices to be used
        // when rendering the bunny. Alternatively, can
        // be created using `new Float32Array(16)`
        var projection: Matrix = mat4.create();        
        var view = mat4.create();
        var invTrans = mat4.create();

        var model = mat4.create();
        //mat4.identity(model);

        var mv = mat4.create();
        mat4.identity(invTrans);

        var height: any
        var width: any
        // Updates the width/height we use to render the
        // final image.
        width = this.gl.drawingBufferWidth
        height = this.gl.drawingBufferHeight

        // Use the lookat/orbit camera
        
        // Updates our camera view matrix.
        this.lookAtCamera.up = [0, 1, 0];

        // from MEL: xform - q - t - ws sceneCamera1;
        // Result: -136.467167 222.846198 -302.588741
        this.lookAtCamera.position = [-136.467167, 222.846198, -302.588741];

        // from MEL: xform - q - t - ws "sceneCamera1aim";
        // Result: -326.315692 117.583301 -172.69315 
        this.lookAtCamera.target = [-326.315692, 117.583301, -172.69315];
        this.lookAtCamera.view(view);
        
        //    this.orbitCamera.tick();
        //    this.orbitCamera.view(view);       

        // Update our pespective projection matrix. This is the bit that's
        // responsible for taking 3D coordinates and projecting
        // them into 2D screen space.        
        var aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;

        // from MEL: getAttr sceneCamera1.focalLength
        // Result: 21 
        var fieldOfView = 1.4171; // 81.2 degrees in radians, or focal length 21.

        // from MEL: getAttr sceneCamera1.nearClipPlane;
        // Result: 1 // 
        var near = 1.0;
        
        // from MEL: getAttr sceneCamera1.farClipPlane;
        // Result: 600 // 
        var far = 600.0;

        // Use helper function to construct projection matrix to convert camera viewspace to clipspace.
        mat4.perspective(projection
            , fieldOfView
            , aspectRatio
            , near
            , far
        )

        // Pre-calculate the inverse view model transform.
        mat4.multiply(mv, view, model);        
        mat4.invert(invTrans, mv);
        mat4.transpose(invTrans, invTrans);        

        function drawMesh() {

            // Sets the viewport, i.e. tells WebGL to draw the
            // scene across the full canvas.
            this.gl.viewport(0, 0, width, height);

            // Enables depth testing, which prevents triangles
            // from overlapping.
            this.gl.enable(this.gl.DEPTH_TEST);

            // Enables face culling, which prevents triangles
            // being visible from behind.
            this.gl.enable(this.gl.CULL_FACE);           
            
            // Unbind Textures.
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);

            // Bind Frame Buffer object.
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

            this.gl.disable(this.gl.BLEND);
            this.gl.depthFunc(this.gl.LESS);       
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);

            this.gl.clearColor(0, 1, 0, 1); //green
           

            for (var drawUnit of drawUnits) {

                // Binds the geometry and sets up the shader's attribute
                // locations accordingly.
                drawUnit.geometry.bind(this.pass_prog);       

                this.pass_prog.uniforms.u_Model = model;
                this.pass_prog.uniforms.u_View = view;
                this.pass_prog.uniforms.u_Persp = projection;
                this.pass_prog.uniforms.u_InvTrans = invTrans;
                this.pass_prog.uniforms.u_Near = near;
                this.pass_prog.uniforms.u_Far = far;
                this.pass_prog.uniforms.u_Texture = drawUnit.texture.bind(0);

                drawUnit.geometry.draw(this.gl.TRIANGLES);

                drawUnit.geometry.unbind();
            }


            // Reset framebuffer and textures.
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }

        function debugDraw() {

            // Enables depth testing, which prevents triangles
            // from overlapping.
            this.gl.enable(this.gl.DEPTH_TEST)

            // Enables face culling, which prevents triangles
            // being visible from behind.
            this.gl.enable(this.gl.CULL_FACE)

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

            for (var drawUnit of drawUnits) {                

                drawUnit.geometry.bind(this.debug_prog);

                this.debug_prog.uniforms.u_Model = model;
                this.debug_prog.uniforms.u_View = view;
                this.debug_prog.uniforms.u_Persp = projection;

                drawUnit.geometry.draw(this.gl.LINES);

                drawUnit.geometry.unbind();

            }
        }        

        //Draw time!

        //First Pass
        //----------        
        drawMesh.bind(this)();

        //Second Pass
        //-----------

        // should not be able to see any red.
        this.gl.clearColor(1, 0, 0, 1);

        //this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        //this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.viewport(0, 0, width, height);  // Viewport is not set automatically!s

        this.diagnostic_prog.bind();

        this.gl.bindAttribLocation(this.diagnostic_prog.program, this.quad_positionLocation, "Position");
        this.gl.bindAttribLocation(this.diagnostic_prog.program, this.quad_texCoordLocation, "Texcoord");

        this.diagnosticLocs = [];
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_DisplayType"));        
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Width"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Height"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Depthtex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Normaltex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Positiontex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Colortex"));

        this.diagnosticLoc_Light = this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Light");

        // Typescript Enum!!
        this.gl.uniform1i(this.diagnosticLocs[0], this.display_type);


        this.gl.uniform1f(this.diagnosticLocs[1], this.gl.drawingBufferWidth);
        this.gl.uniform1f(this.diagnosticLocs[2], this.gl.drawingBufferHeight);

        // Bind depth texture to unit 0.        
        this.depthRGBTexture.bind(0);
        this.gl.uniform1i(this.diagnosticLocs[3], 0);

        this.normalTexture.bind(1);
        this.gl.uniform1i(this.diagnosticLocs[4], 1);

        this.positionTexture.bind(2);
        this.gl.uniform1i(this.diagnosticLocs[5], 2);

        this.colorTexture.bind(3);
        this.gl.uniform1i(this.diagnosticLocs[6], 3);

        var lightPos = vec3.create();
        // from MEL: xform - q - t - ws pointLight1;
        // Result: -518.171919 179.003923 -242.517068
        vec3.set(lightPos, -518.171919, 179.003923, -242.517068);
        var lightdest = vec3.create();
        vec3.transformMat4(lightdest, lightPos, view);

        this.gl.uniform3fv(this.diagnosticLoc_Light, lightdest); 

        this.gl.enableVertexAttribArray(this.quad_positionLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_vertices);
        this.gl.vertexAttribPointer(this.quad_positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(this.quad_texCoordLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo_textures);
        this.gl.vertexAttribPointer(this.quad_texCoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vbo_indices);

        this.gl.drawElements(this.gl.TRIANGLES, this.device_quad.num_indices, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(this.quad_positionLocation);
        this.gl.disableVertexAttribArray(this.quad_texCoordLocation);

        this.gl.disable(this.gl.BLEND);

        // Debug draw the geometry buffers. Don't render positionTexture because it hasn't been normalised by the camera's far clip.
        pip([this.depthRGBTexture, this.colorTexture, this.normalTexture]);
        
    }
    
}

export default Renderer;