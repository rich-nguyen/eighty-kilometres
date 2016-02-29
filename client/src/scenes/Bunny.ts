// A basic bunny scene

import * as bunny from 'bunny'
import Geometry = require('gl-geometry')
import { Context, Matrix } from 'stackgl'
var glShader = require('gl-shader')
var normals = require('normals')
var glslify = require('glslify')
import { Scene } from '../SceneManager'
import { DrawUnit } from '../Renderer'

export class Bunny implements Scene {

    private geometry: Geometry;
    private shader: any;

    public load(context: Context): void {
        if (!this.geometry) {
            // Load the bunny mesh data (a simplicial complex)
            // into a gl-geometry instance, calculating vertex
            // normals for you. A simplicial complex is simply
            // a list of vertices and faces – conventionally called
            // `positions` and `cells` respectively. If you're familiar
            // with three.js, this is essentially equivalent to an array
            // of `THREE.Vector3` and `THREE.Face3` instances, except specified
            // as arrays for simplicity and interoperability.
            this.geometry = new Geometry(context)

            this.geometry.attr('aPosition', bunny.positions)
            this.geometry.attr('aNormal', normals.vertexNormals(
                bunny.cells,
                bunny.positions
            ))

            this.geometry.faces(bunny.cells)
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
                glslify('../shaders/bunny.vert')
                , glslify('../shaders/bunny.frag')
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