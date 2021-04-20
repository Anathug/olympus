import { Scene, sRGBEncoding, WebGLRenderer, CubeTextureLoader, LinearFilter } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';

import * as dat from 'dat.gui'

import Sizes from './Tools/Sizes'
import Time from './Tools/Time'
import Assets from './Tools/Loader'

import Camera from './Camera'
import World from './World/index'
import Mouse from './Mouse'
import Starship from './World/Starship.js'

import postVertexShader from '../shaders/post/vertexShader.glsl'
import postFragmentShader from '../shaders/post/fragmentShader.glsl'


// import gsap from 'gsap'

export default class App {
  constructor(options) {
    this.canvas = options.canvas

    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()
    this.mouse = new Mouse()

    this.counter = 0.0
    this.starship = null
    this.myEffect = null
    this.lut = true

    setTimeout(() => {
      this.setConfig()
      this.setScene()
      this.setStarship()
      this.setCamera()
      this.setRenderer()
      this.setWorld()
    }, 1000);
  }

  setScene() {
    this.scene = new Scene()
    const cubeLoader = new CubeTextureLoader

    const textureCube = cubeLoader.load([
      require('../textures/hdri/px.png').default, require('../textures/hdri/nx.png').default,
      require('../textures/hdri/py.png').default, require('../textures/hdri/ny.png').default,
      require('../textures/hdri/pz.png').default, require('../textures/hdri/nz.png').default
    ]);
    textureCube.minFilter = LinearFilter
    this.scene.background = textureCube
  }

  setRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.gammaFactor = 2.2

    this.renderer.setClearColor(0x212121, 1)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    this.sizes.on('resize', () => {
      this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    })

    const composer = new EffectComposer(this.renderer)
    composer.addPass(new RenderPass(this.scene, this.camera.camera))

    this.myEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: this.counter }
      },
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader
    }

    const customPass = new ShaderPass(this.myEffect);
    customPass.renderToScreen = true
    composer.addPass(customPass)

    let lutMap
    let lutPass = new LUTPass();


    new LUTCubeLoader()
      .load('lut/kodak_5218_kodak_2395.cube', (result) => {
        lutMap = result
        lutPass.lut = lutMap.texture
        composer.addPass(lutPass)
      })

    // const filmPass = new FilmPass(
    //   0.35,  
    //   0.025, 
    //   648, 
    //   false,
    // );
    // filmPass.renderToScreen = true
    // composer.addPass(filmPass)


    this.time.on('tick', () => {
      this.counter += 0.01
      if (!this.lut) {
        composer.removePass(lutPass)
      }
      customPass.uniforms["amount"].value = this.counter
      composer.render()
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.open()
      this.lut = { activated: true }
      folder.add(this.lut, 'activated').name('lut').listen().onChange(() => {
        if (this.lut) {
          composer.addPass(lutPass)
          this.lut = false
        } else {
          composer.removePass(lutPass)
          this.lut = true
        }
      })
      folder.add(this.renderOnBlur, 'activated').name('Render on window blur')
    }
  }

  setStarship() {
    this.starship = new Starship({
      time: this.time,
      assets: this.assets,
      world: this.world,
      debug: this.debug
    })
    this.scene.add(this.starship.container)
  }
  setCamera() {
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
      mouse: this.mouse,
      assets: this.assets,
      scene: this.scene
    })

    this.scene.add(this.camera.container)
  }

  setWorld() {
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      camera: this.camera,
      scene: this.scene,
      mouse: this.mouse,
      starship: this.starship,
      renderer: this.renderer,
    })
    this.scene.add(this.world.container)
  }

  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
  }
}
