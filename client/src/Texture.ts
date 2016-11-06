
/// <reference path="types/stackgl.d.ts" />

import when = require('when')
import { Context, Matrix, Mesh, Texture2D } from 'stackgl'

export function loadTexture(path:string): when.Promise<HTMLImageElement> {
    const promise: when.Promise<HTMLImageElement> = when.promise<HTMLImageElement>(function(resolve, reject){
        let textureImage = new Image();
        
        textureImage.onload = () => {
            resolve(textureImage);
        }
        textureImage.onerror = reject;
        textureImage.src = path;     
    });
    return promise;
}
