// A Pastoral Landscape

/// <reference path="../ambient/stackgl.d.ts" />
/// <reference path="../ambient/typings/main.d.ts" />

import { Context, Matrix, Mesh, Texture2D } from 'stackgl'
import { Scene } from '../SceneManager'
import { DrawUnit } from '../Renderer'
import Geometry = require('gl-geometry')
import glShader = require('gl-shader')
import glslify = require('glslify')
import parseObj = require('parse-wavefront-obj')
import qwest = require('qwest')
import _ = require('lodash')
import unindex = require('unindex-mesh')
import createTexture = require('gl-texture2d')

export class PastoralLandscape implements Scene {
    
    private floorplanGeometry: Geometry;
    private floorplanAmbientTex: Texture2D;

    constructor() {
    }

    private handleTextureLoaded(context: Context, floorplanObj: any, floorplanImg: any): void {
        this.floorplanAmbientTex = createTexture(context, floorplanImg);

        /* responseText is a wavefront obj file, which will be parsed into a JS object:
            - positions - an array of vec3 points.
            - vertexNormals - an array of vec3 normals.
            - vertexUVs - an array of vec2 UV co-ordinates.
            - cells - a 2D index array referencing values from 'positions'.
                The first dimension is the cell, and the second is the vertex of the triangle.
            - faceNormals - an index array referencing values from 'vertexNormals'.
                The first dimension is the cell/face, and the second is the vertex of the triangle.
            - faceUVs - an index array referencing values from 'vertexUVs'.
                The first dimension is the cell/face, and the second is the vertex of the triangle.
        */

        this.floorplanGeometry = new Geometry(context);

        /* Dependening on the geometry, we render in one of two ways:
            - Use an array of index references to draw cells, calling through to drawElements.
                - vertex information is normalised, and one vertex is shared by each adjacent cell.
                - smaller arrays, quicker draw.
            - Use an array of values to draw  cells, calling through to drawArrays.
                - vertex information is per-face, so each instance of the vertex has it's own normal/uv. Good for angled/unsmooth geometry. 
                - slower draw, unindexing is needed.
        */

        // Use chunk for debugging. The Geometry class does understand flat arrays, but these are hard for me to read/debug.
        const unindexedPositions: any = _.chunk(unindex(floorplanObj.positions, floorplanObj.cells), 3);
        const unindexedNormals: any = _.chunk(unindex(floorplanObj.vertexNormals, floorplanObj.faceNormals), 3);
        const unindexedUVs: any = _.chunk(unindex(floorplanObj.vertexUVs, floorplanObj.faceUVs), 2);

        this.floorplanGeometry.attr('Position', unindexedPositions);
        this.floorplanGeometry.attr('Normal', unindexedNormals);
        this.floorplanGeometry.attr('Texcoord', unindexedUVs);
    }

    public load(context: Context): void {

        // 1. Sync loaded obj files. From the server.
            // Load the obj file into memory, and pare using parse-wavefront-obj.
            // Try basic render.

        //async load "http://localhost:9000/client/assets/built-assets/teapot.obj", then parse it.
        if (!this.floorplanGeometry) {            
            qwest.get('http://localhost:9000/client/assets/built-assets/floorplan.obj').then((objModel: any) => {
                qwest.get('http://localhost:9000/client/assets/built-assets/floorplan.jpg').then((tifTexture: any) => {                
                    const floorplanObj = parseObj(<string>objModel.responseText);

                    let textureImage = new Image();
                    
                    textureImage.onload = () => {
                        this.handleTextureLoaded(context, floorplanObj, textureImage);
                    }
                    textureImage.src = 'http://localhost:9000/client/assets/built-assets/floorplan.jpg';                    
                });
            });
        }
        
    }

    public getDrawUnits(): DrawUnit[] {
        var drawUnits: DrawUnit[] = [];

        if (this.floorplanGeometry) {
            drawUnits[0] = {
                geometry: this.floorplanGeometry,
                texture: this.floorplanAmbientTex,
                shader: null
            };
        }
        return drawUnits;
    }
}