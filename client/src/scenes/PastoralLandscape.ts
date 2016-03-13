// A Pastoral Landscape

/// <reference path="../ambient/stackgl.d.ts" />
/// <reference path="../ambient/typings/main.d.ts" />

import { Context, Matrix, Mesh } from 'stackgl'
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

    private grassGeometry: Geometry;

    private shader: any;

    private teapotGeometry: Geometry;
    private teapot: Mesh;

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
            qwest.get('http://localhost:9000/client/assets/built-assets/floorplan.obj')
                .then((response: any) => {
                    this.teapot = parseObj(<string>response.responseText);
                    this.teapotGeometry = new Geometry(context);
                    this.teapotGeometry.attr('aPosition', this.teapot.positions);
                    this.teapotGeometry.faces(this.teapot.cells);
                    console.log(this.teapot);
                });
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
        if (!this.grassGeometry) {
            this.grassGeometry = new Geometry(context)
            this.grassGeometry.attr('aPosition', this.grassPositions);
            this.grassGeometry.faces(this.grassCells);
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
            );
        }
    }

    public getDrawUnits(): DrawUnit[] {
        var drawUnits: DrawUnit[] = [];

        /*if (this.grassGeometry) {
            drawUnits[0] = {
                geometry: this.grassGeometry,
                shader: this.shader
            };
        }*/
        if (this.teapotGeometry) {
            drawUnits[0] = {
                geometry: this.teapotGeometry,
                shader: this.shader
            };
        }
        return drawUnits;
    }
}