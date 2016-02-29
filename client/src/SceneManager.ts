// The scene, loaded as a package from some source (server or app resource)
// will be updated by the game logic, and drawn to screen by the renderer.

/// <reference path="ambient/typings/main.d.ts" />
/// <reference path="ambient/stackgl.d.ts" />


import { Bunny } from './scenes/Bunny'
import { Context } from 'stackgl'
import { DrawUnit } from './Renderer'

export interface Scene {
    load(context: Context): void
    getDrawUnits(): DrawUnit[]
}

export class SceneManager {
    private currentScene: Scene;

    public loadScene(context: Context): void {
        this.currentScene = new Bunny();
        this.currentScene.load(context);
    }

    public getDrawUnits(): DrawUnit[] {
        if (this.currentScene) {
            return this.currentScene.getDrawUnits()
        } else {
            return [];
        }
    }
        

}

export default SceneManager;