// A Pastoral Landscape

/// <reference path="../ambient/stackgl.d.ts" />
/// <reference path="../ambient/typings/main.d.ts" />

import { Context, Matrix } from 'stackgl'
import { Scene } from '../SceneManager'
import { DrawUnit } from '../Renderer'
import Geometry = require('gl-geometry')
import glShader = require('gl-shader')
import glslify = require('glslify')
import parseObj = require('parse-wavefront-obj')
import qwest = require('qwest')

export class PastoralLandscape implements Scene {
    
    private grassPositions: number[][];
    private grassCells: number[][];

    private sky: any;    

    private geometry: Geometry;
    private shader: any;

    private teapot: any;

    constructor() {
        this.grassPositions = [
            [-1, 0,  1],
            [ 1, 0,  1],
            [ 1, 0, -1],
            [-1, 0, -1]
        ];
        this.grassCells = [
            [0,  1,  2],
            [3,  0,  2]
        ]
    }

    public load(context: Context): void {

        // 1. Sync loaded obj files. From the server.
            // Load the obj file into memory, and pare using parse-wavefront-obj.
            // Try basic render.
        //async load "http://localhost:9000/client/assets/built-assets/teapot.obj", then parse it.
        if (!this.teapot) {
            this.teapot = 'pending';
            qwest.get('http://localhost:9000/client/assets/built-assets/teapot.obj')
                .then(function(response: any) {
                    alert(response);
                    this.teapot = response.responseText;
                }.bind(this));
        }

        // 2. construct shader. Needs:
            // a list of vertices,
            // a list of indices for drawing.
            // uniforms for light,
            // uniform for pre-computed proj matrices, to be sent to vert shader. model is the position
            // attributes?
            // what are attrib locations?

            // Depends on Light and Camera for scene

        // This Grass quad is inlined. for easy drawing.
        if (!this.geometry) {            
            this.geometry = new Geometry(context)
            this.geometry.attr('aPosition', this.grassPositions)           
            this.geometry.faces(this.grassCells)
        }

        if (!this.shader) {
            // Pulls up our shader code and returns an instance
            // of gl-shader. Using the glslify browserify transform,
            // these will be passed through glslify first to pull in
            // any external GLSL modules (of which there are none in
            // this example) and perform the uniform/attribute parsing
            // step ahead of time. We can make some dramatic file size
            // savings by doing this in Node rather then at runtime in
            // the browser.
            this.shader = glShader(context,
                glslify('../shaders/basic.vert')
                , glslify('../shaders/basic.frag')
            )
        }
    }

    public getDrawUnits(): DrawUnit[] {
        return [
        {
            geometry: this.geometry,
            shader: this.shader
        }];
    }
}