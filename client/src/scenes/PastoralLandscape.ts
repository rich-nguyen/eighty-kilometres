// A Pastoral Landscape

import Geometry = require('gl-geometry')
import { Context, Matrix } from 'stackgl'
var glShader = require('gl-shader')
var normals = require('normals')
var glslify = require('glslify')
import { Scene } from '../SceneManager'
import { DrawUnit } from '../Renderer'

export class PastoralLandscape implements Scene {
    
    private grassPositions: number[][];
    private grassCells: number[][];

    private sky: any;    

    private geometry: Geometry;
    private shader: any;

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