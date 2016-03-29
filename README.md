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
- global illumination. Radiosity, photon mapping. Radiosity replaces ambient and diffuse terms in standard lighting.
- BRDF surface shader. Oren-Nayar, Cook-Torrance.
- shadows. Variance shadow maps.
- Anti aliasing.
- Sky box. gl-skybox
- Deferred shading, G Buffers. Tiled shader is more performant.
- Bloom.
- Web worker.
- DevicePixelRatio = 0.7 render, then use css as upscaler. https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

####Sexy features
- Light propagation volumes. http://www.lionhead.com/blog/2014/april/17/dynamic-global-illumination-in-fable-legends/

#####Deferred Passes
- direct illumination.
- global illumination. Baked, not Pre-computed.
- shadow pass.
- depth pass.

#####Reading list: BRDF
- https://renderman.pixar.com/view/cook-torrance-shader
- http://simonstechblog.blogspot.co.uk/2011/12/microfacet-brdf.html
- http://graphicrants.blogspot.co.uk/2013/08/specular-brdf-reference.html
- http://dontnormalize.me/tag/cook-torrance/

#####Reading list: General
- http://www.valvesoftware.com/publications/2006/SIGGRAPH06_Course_ShadingInValvesSourceEngine.pdf
- https://unity3d.com/learn/tutorials/modules/beginner/graphics/lighting-and-rendering

#####Reading list: Deferred shading
Remeber, deferred shading is possible with WebGL 1.0, but you would have to write a single texture (eg. color & depth, then normals) per pass.
- https://hacks.mozilla.org/2014/01/webgl-deferred-shading/
- http://codeflow.org/entries/2012/aug/25/webgl-deferred-irradiance-volumes/
- http://learnopengl.com/#!Advanced-Lighting/Deferred-Shading
- http://www.slideshare.net/guerrillagames/deferred-rendering-in-killzone-2-9691589
- https://github.com/tiansijie/DeferredShader
- http://math.hws.edu/graphicsbook/c7/s4.html render to texture guide

####Entry 5 - Modelling
- Get the wacom out. https://www.youtube.com/watch?v=OFBmg-N41gs
- First MEL command in a while: worldspace translation for transform: xform -q -t -ws "sceneCamera1aim" 

