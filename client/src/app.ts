/// <reference path="ambient/typings/main.d.ts" />
/// <reference path="ambient/stackgl.d.ts" />




import * as mat4 from 'gl-mat4'



import { Context, Matrix } from 'stackgl'
import Renderer from './Renderer';
import SceneManager from './SceneManager';

export class Application {
  static app: Application = new Application();  

  private renderer: Renderer;
  private sceneManager: SceneManager;
  

  public run(): void {
    this.sceneManager = new SceneManager();     
    this.renderer = new Renderer();      
  }

  // The logic/update loop, which updates all of the variables
  // before they're used in our render function. It's optional
  // for you to keep `update` and `render` as separate steps.
  public update() {
    this.sceneManager.load(this.renderer.gl);

    var drawUnits =this.sceneManager.getDrawUnit();


    this.renderer.render(drawUnits);
  }
}

Application.app.run();

