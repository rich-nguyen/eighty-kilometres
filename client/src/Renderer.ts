// The renderer. Draws objects contained in scenes.
// Deferred rendering system based on https://github.com/YuqinShao/Tile_Based_WebGL_DeferredShader

/// <reference path="ambient/typings/main.d.ts" />
/// <reference path="ambient/stackgl.d.ts" />

import { Context, Matrix, Shader } from 'stackgl'
import { Application } from './app'
import createContext = require('gl-context')
import * as mat4 from 'gl-mat4'
import * as vec3 from 'gl-vec3'
import fit = require('canvas-fit')

import glslify = require('glslify')
import glShader = require('gl-shader')

import LookAtCamera = require('lookat-camera')
import orbitCamera = require('canvas-orbit-camera')

export interface DrawUnit {
    geometry: any
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
    private canvas: Node;
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

    private normalTexture: WebGLTexture;
    private colorTexture: WebGLTexture;
    private positionTexture: WebGLTexture;
    private depthRGBTexture: WebGLTexture;

    private lookAtCamera: LookAtCamera;
    private orbitCamera: any;


    constructor() {
        // Creates a canvas element and attaches
        // it to the <body> on your DOM.hello richard, i loveyou x
        this.canvas = document.body.appendChild(document.createElement('canvas'));

        // Creates an instance of look-at camera and orbit camera.
        this.lookAtCamera = new LookAtCamera();
        this.orbitCamera = orbitCamera(this.canvas);      

        // A small convenience function for creating
        // a new WebGL context – the `render` function
        // supplied here is called every frame to draw
        // to the screen.
        this.gl = createContext(this.canvas, Application.app.update);

        var ext = this.gl.getExtension('WEBGL_draw_buffers');
        if (!ext) {
            console.log("Draw Buffers are not supported in this browser.");
        }
        
        var extDepth = this.gl.getExtension("WEBGL_depth_texture");

        if (!extDepth) {
            console.log("Extension Depth texture is not supported in this browser.");       
        }

        this.gl.getExtension("OES_texture_float");
        this.gl.getExtension("OES_texture_float_linear");

        // Create and bind framebuffer object.
        this.frameBuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

        // Setup deferred shading by attaching textures to different frame buffer color attachments.
        this.normalTexture = this.gl.createTexture();        
        this.colorTexture = this.gl.createTexture();
        this.positionTexture = this.gl.createTexture();
        this.depthRGBTexture = this.gl.createTexture();

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);


        this.gl.bindTexture(this.gl.TEXTURE_2D, this.positionTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);


        this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);


        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthRGBTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);

        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL, this.gl.TEXTURE_2D, this.normalTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT1_WEBGL, this.gl.TEXTURE_2D, this.colorTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT2_WEBGL, this.gl.TEXTURE_2D, this.positionTexture, 0);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT3_WEBGL, this.gl.TEXTURE_2D, this.depthRGBTexture, 0);

        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE) {
            // Can't use framebuffer.
            // See http://www.khronos.org/opengles/sdk/docs/man/xhtml/glCheckFramebufferStatus.xml
            console.log("Frame buffer initialisation failed");
        }

        // The drawBuffersWEBGL extension allows us to define the draw buffers to which fragment colors will be written.
        // The fragment shader will write to the buffers using gl_FragData.
        ext.drawBuffersWEBGL([
            ext.COLOR_ATTACHMENT0_WEBGL, // gl_FragData[0] Normal
            ext.COLOR_ATTACHMENT1_WEBGL, // gl_FragData[1] Color
            ext.COLOR_ATTACHMENT2_WEBGL, // gl_FragData[2] Position
            ext.COLOR_ATTACHMENT3_WEBGL  // gl_FragData[3] Depth
        ]);


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
        

        

        
        
        this.display_type = DisplayType.Depth;     

        // Resizes the <canvas> to fully fit the window
        // whenever the window is resized.
        window.addEventListener('resize'
            , fit(this.canvas)
            , false
        )
    }

    public render(drawUnits: DrawUnit[]): void {

        // Create the base matrices to be used
        // when rendering the bunny. Alternatively, can
        // be created using `new Float32Array(16)`
        var projection: Matrix = mat4.create();        
        var view = mat4.create();
        var invTrans = mat4.create();

        var model = mat4.create();
        mat4.identity(model);

        var mv = mat4.create();
        mat4.identity(invTrans);

        var height: any
        var width: any
        // Updates the width/height we use to render the
        // final image.
        width = this.gl.drawingBufferWidth
        height = this.gl.drawingBufferHeight

        // Use the lookat/orbit camera
        if (false) {
        } else if(true) {
            // Updates our camera view matrix.
            this.lookAtCamera.up = [0, 1, 0];

            // from MEL: xform - q - t - ws sceneCamera1;
            // Result: -136.467167 222.846198 -302.588741
            this.lookAtCamera.position = [-136.467167, 222.846198, -302.588741];

            // from MEL: xform - q - t - ws "sceneCamera1aim";
            // Result: -326.315692 117.583301 -172.69315 
            this.lookAtCamera.target = [-326.315692, 117.583301, -172.69315];
            this.lookAtCamera.view(view);
        } else {
            this.orbitCamera.tick();
            this.orbitCamera.view(view);
        }


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

        mat4.perspective(projection
            , fieldOfView
            , aspectRatio
            , near
            , far
        )

        mat4.multiply(view, model, mv);        
        mat4.invert(invTrans, mv);
        mat4.transpose(invTrans, invTrans);

        // Sets the viewport, i.e. tells WebGL to draw the
        // scene across the full canvas.
        this.gl.viewport(0, 0, width, height)

        // Enables depth testing, which prevents triangles
        // from overlapping.
        //this.gl.enable(this.gl.DEPTH_TEST)

        // Enables face culling, which prevents triangles
        // being visible from behind.
        //this.gl.enable(this.gl.CULL_FACE)

        function drawMesh() {

            //drawmesh() {
            //bind buffer here, ie
            //    bind array buffer
            //    bind element buffer
            //}
            //draw elements, using pass_prog
            //this.gl.useProgram(pass_prog);

            for (var drawUnit of drawUnits) {

                // Binds the geometry and sets up the shader's attribute
                // locations accordingly.
                //drawUnit.geometry.bind(drawUnit.shader)
                drawUnit.geometry.bind(this.pass_prog);

                this.positionLocation = this.gl.getAttribLocation(this.pass_prog.program, "Position");
                this.normalLocation = this.gl.getAttribLocation(this.pass_prog.program, "Normal");
                this.texCoordLocation = this.gl.getAttribLocation(this.pass_prog.program, "Texcoord");

                //var u_textureLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_Texutre");

                this.u_ModelLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_Model");
                this.u_ViewLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_View");
                this.u_PerspLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_Persp");
                this.u_InvTransLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_InvTrans");
                this.u_ColorSamplerLocation = this.gl.getUniformLocation(this.pass_prog.program, "u_ColorSampler");

                //function setMatrixUniforms(model)
                {
                    this.gl.uniformMatrix4fv(this.u_ModelLocation, false, model);
                    this.gl.uniformMatrix4fv(this.u_ViewLocation, false, view);
                    this.gl.uniformMatrix4fv(this.u_PerspLocation, false, projection);
                    this.gl.uniformMatrix4fv(this.u_InvTransLocation, false, invTrans);
                }

                // Updates our model/view/projection matrices, sending them
                // to the GPU as uniform variables that we can use in
                // `shaders/bunny.vert` and `shaders/bunny.frag`.
                //drawUnit.shader.uniforms.uProjection = projection;
                //drawUnit.shader.uniforms.uView = view;
                //drawUnit.shader.uniforms.uModel = model;

                drawUnit.geometry.draw(this.gl.TRIANGLES)    
            }
        }

        

        //Draw time!

        //First Pass

        //Sort Camera out.

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);

        //unbind Textures using setTextures();

        //bindFBO(0);
        this.gl.disable(this.gl.BLEND);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        drawMesh.bind(this)();        

        //Second Pass

        //should unbind Textures using setTextures();

        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        //reset framebuffer and textures
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        this.gl.useProgram(this.diagnostic_prog.program);

        this.gl.bindAttribLocation(this.diagnostic_prog.program, this.quad_positionLocation, "Position");
        this.gl.bindAttribLocation(this.diagnostic_prog.program, this.quad_texCoordLocation, "Texcoord");

        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_DisplayType"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Near"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Far"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Width"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Height"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Depthtex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Normaltex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Positiontex"));
        this.diagnosticLocs.push(this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Colortex"));

        this.diagnosticLoc_Light = this.gl.getUniformLocation(this.diagnostic_prog.program, "u_Light");


        // Typescript Enum!!
        this.gl.uniform1i(this.diagnosticLocs[0], this.display_type);

        this.gl.uniform1f(this.diagnosticLocs[1], near);
        this.gl.uniform1f(this.diagnosticLocs[2], far);


        this.gl.uniform1f(this.diagnosticLocs[3], this.gl.drawingBufferWidth);
        this.gl.uniform1f(this.diagnosticLocs[4], this.gl.drawingBufferHeight);

        // make texture unit 0 active.
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthRGBTexture); //??
        this.gl.uniform1i(this.diagnosticLocs[5], 0);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTexture);
        this.gl.uniform1i(this.diagnosticLocs[6], 1);

        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.positionTexture);
        this.gl.uniform1i(this.diagnosticLocs[7], 2);

        this.gl.activeTexture(this.gl.TEXTURE3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
        this.gl.uniform1i(this.diagnosticLocs[8], 3);

        var lightPos = vec3.create([0.0, 10.0, 0.0]);
        var lightdest = vec3.create();
        vec3.transformMat4(view, lightPos, lightdest);        

        this.gl.uniform3fv(this.diagnosticLoc_Light, lightdest); 

        //drawQuad()
        // ie bind then draw elements. This quad is a screen space quad! It fills entire screen to cause a full redraw.
        // see initializeQuad.

        this.gl.disable(this.gl.BLEND);
        
    }
    
}

export default Renderer;