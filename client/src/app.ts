

import Renderer from './Renderer';
import SceneManager from './SceneManager';

export class Application {
  static app: Application = new Application();  

  private renderer: Renderer;
  private sceneManager: SceneManager;

  public run(): void {
    this.sceneManager = new SceneManager();     
    this.renderer = new Renderer();
    this.sceneManager.loadScene(this.renderer.gl);  
  }

  // The logic/update loop, which updates all of the variables
  // before they're used in our render function. It's optional
  // for you to keep `update` and `render` as separate steps.
  public update = () => {

    var drawUnits = this.sceneManager.getDrawUnits();
    this.renderer.render(drawUnits);
  }
}

Application.app.run();

