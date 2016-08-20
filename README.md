###Tools used

1. aws-cli - brew install awscli
2. beefy - npm install -g beefy@2.1.6 browserify@12.0.0 gulp-cli@1.2.0
- Build prod: gulp
- Build dev : beefy src/app.ts:app.js 8000 -- -p [ tsify ]
3. typescript - npm install -g typescript@1.7.5 typings@0.6.6
- typings install, in src/ambient folder

###Log Book

####Entry 1 - Render decisions

Babylon maybe too heavy? Want something lightweight where we can do most things ourselves(eek), but get some help on maths and physics via libraries.
This is the path to a simple programmable rendering pipeline. Best candidates:
- http://stack.gl/
- http://twgljs.org/

Good tutorials here, first one has a nice discard and fresnel shader!
- http://gamedevelopment.tutsplus.com/tutorials/building-shaders-with-babylonjs-and-webgl-theory-and-examples--cms-24146 
- http://ogldev.atspace.co.uk/index.html 

And a nice shader workflow tool here:
- http://i-am-glow.com/

Useful maths library performance here.
- https://jsperf.com/webgl-math-library-comparisson

Model formatting is another thing to skip around. Try asset import?
- https://github.com/acgessler/assimp2json

Conclusion: Try stack.gl. it's small and modular, shader-oriented.

- add stack gl canvas-loop

Debugging:
- Try http://google.github.io/tracing-framework/analyzing-traces.html
- https://hacks.mozilla.org/2013/11/live-editing-webgl-shaders-with-firefox-developer-tools/

####Entry 2 - Prepping the codebase

Adding gulp, typescript, typings, tsify, definition files! That's enough to get type annotations when rendering stuff.
Can't find many existing type definitions for stackgl, and it looks like beefy may struggle with gulp.
- https://basarat.gitbooks.io/typescript/content/
- https://blogs.msdn.microsoft.com/typescript/
- https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md


####Entry 3 - WebGl Threading
Async webgl would be ideal. a webgl web worker? three js is a retained mode wrapper
- https://blog.mozilla.org/research/2014/07/22/webgl-in-web-workers-today-and-faster-than-expected/
- https://hacks.mozilla.org/2016/01/webgl-off-the-main-thread/
- Set extensions using webglew

####Entry 4 - Shading wishlist

#####Must have features
- global illumination. Radiosity, photon mapping. A baked radiosity solution replaces the ambient and diffuse terms in standard lighting, but doesn't model dynamic lights; too slow for that, of course.
- BRDF surface shader. Oren-Nayar(BRDF diffuse), Cook-Torrance (BRDF specular).
- shadows. Variance shadow maps.
- Anti aliasing.
- Sky box. gl-skybox
- Deferred shading, G Buffers. Tiled shader is more performant.
- Bloom and HDR.
- Web worker.
- DevicePixelRatio = 0.7 render, then use css as upscaler. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

#### Global illumination, real time options
- Light propagation volumes. http://www.lionhead.com/blog/2014/april/17/dynamic-global-illumination-in-fable-legends/
- More LPV: http://www.crytek.com/download/Light_Propagation_Volumes.pdf
- Deferred irradiance volumes. http://codeflow.org/entries/2012/aug/25/webgl-deferred-irradiance-volumes
- Directional irradiance volumes, like Source. http://www.cs.utah.edu/~shirley/papers/irradiance.pdf

#####Shading model
- direct illumination (diffuse, specular).
- global illumination (ambient). Baked could be made with a radiosity solver. Pre-computed could be possible with a light probes implementation.

####Entry 5 - Real time lighting: what will the composite image be made from?
- Easy one first: the direct illumination from local light emitters. Take the two nearest local lights.
    - Includes albedo, which will be a single color for a surface, stylistically.
- If the object is static, we could add an ambient diffuse term using a baked global illumination lightmap, calculated from a radiosity solver. Eg. for the world model. Also accouts for albedo, from the static model.
- If the object is dynamic, we want to use this lighting pipeline for the ambient diffuse term:
    - Pre-compute light probes (whenever the local lights dictate an update is needed). Takes a scene rendered from local-light and baked GI, and samples the light values from various directions to create an irradiance volume (we'll call it the light probe).
    - At render time, take the nearest light probe to the model, and use the averaged directional irradiance light to find an approximate GI ambient term for the dynamic model.
- This makes `diffuseLighting = OrenNayarlightOneTerm + OrenNayarlightTwoTerm + GIAmbientTerm * albedo` 
- Finally, don't forget specular, for dynamic objects. Assuming static objects have static or zero specular, for now. 

#####Reading list: BRDF
- https://renderman.pixar.com/view/cook-torrance-shader
- http://simonstechblog.blogspot.co.uk/2011/12/microfacet-brdf.html (with energy conservation functions for specular and diffuse)
- http://graphicrants.blogspot.co.uk/2013/08/specular-brdf-reference.html
- http://dontnormalize.me/tag/cook-torrance/
- https://sdm.scad.edu/faculty/mkesson/vsfx755/wip/best/spring2012/kevin_george/final/index.html

#####Reading list: General
- http://www.valvesoftware.com/publications/2006/SIGGRAPH06_Course_ShadingInValvesSourceEngine.pdf
- http://www2.ati.com/developer/gdc/D3DTutorial10_Half-Life2_Shading.pdf
- https://unity3d.com/learn/tutorials/modules/beginner/graphics/lighting-and-rendering

#####Reading list: Deferred shading
Remeber, deferred shading is possible with WebGL 1.0, but you would have to write a single texture (eg. color & depth, then normals) per pass.
- https://hacks.mozilla.org/2014/01/webgl-deferred-shading/
- http://learnopengl.com/#!Advanced-Lighting/Deferred-Shading
- http://www.slideshare.net/guerrillagames/deferred-rendering-in-killzone-2-9691589
- https://github.com/tiansijie/DeferredShader
- http://math.hws.edu/graphicsbook/c7/s4.html render to texture guide

####Entry 5 - Modelling
- Get the wacom out. https://www.youtube.com/watch?v=OFBmg-N41gs
- First MEL command in a while: worldspace translation for transform: xform -q -t -ws "sceneCamera1aim" 

####Entry 6 - Simple scene lighting
The simplest way I can think of shading a scene, without it looking like a fixed-function pipeline, is to cheat. That is, account for ambient lighting statically, and sum any contribution from nearby dynamic lights on top of that. Benefits:
    - Even having two lambert lights, say half lambert diffuse, looks better than one.
    - The ambient light contribution is higher when we use half lambert, and gives a huge visual quality increase compared to a constant ambient light value.

Steps needed:
- create lightmaps in Maya. Open the scene which will be the background of the scene.
    - Make sure there is a light in the scene.
    - Make sure there is a uv set created. Use Automatic Mapping to start with!
    - In Maya, go to Lighting/Shading, Batch Bake (mental ray). You must have mental ray installed to do this. In the options, make sure we are baking to texture, not vertices, and hit convert. Maya will create a `.tif` file in the directory `<project-folder>\renderData\mentalray\lightMap`. Tips:
        - Tick "keep original shading network" in the batch bake options to reduce the chance of destroying shade graph with a file node.
        - Select the object you want to export!
        - Use option "bake set override" if you want to play with settings ad-hoc.
        - we may want a separate occlusion map too, one day.
- Update the renderer so that it can take a single texture with a set of UVs.
- Add two dynamic lights to the scene using standard lambert shading that has been used so far.

####Maya Gotchas
- completely lost shading on a mesh: it was the Mesh Component Display, Display Colors was ticked. Untick it, or toggle it with Color->Toggle Display Colors Attribute.

