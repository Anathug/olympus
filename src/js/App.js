import { Scene, sRGBEncoding, WebGLRenderer, Color, CubeTexture, Fog } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js'
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js'

import * as dat from 'dat.gui'

import Camera from './Camera'
import World from './World/index'

import Starship from './World/Starship.js'
import Mars from './World/Mars.js'
import Earth from './World/Earth.js'

import postVertexShader from '../shaders/post/vertexShader.glsl'
import postFragmentShader from '../shaders/post/fragmentShader.glsl'

export default class App {
  constructor(options) {
    this.canvas = options.canvas
    this.assets = options.assets
    this.time = options.time
    this.sizes = options.sizes
    this.mouse = options.mouse
    this.params = {
      fog: {
        color: 0x010218,
        near: 10,
        far: 150,
      },
    }

    this.counter = 0.0
    this.starship = null
    this.myEffect = null
    this.lut = true
    this.composer = null
    this.cubeMap = null

    this.switchHDRI = this.switchHDRI.bind(this)

    this.setScene()
    this.setConfig()
    this.setStarship()
    this.setMars()
    this.setEarth()
    this.createRenderer()
    this.setCamera()
    this.setRenderer()
    this.setWorld()
  }

  setScene() {
    this.scene = new Scene()
    this.cubeMap = new CubeTexture()
    const t = this.assets.textures.hdri

    this.cubeMap.images[0] = t.px.image
    this.cubeMap.images[1] = t.nx.image
    this.cubeMap.images[2] = t.py.image
    this.cubeMap.images[3] = t.ny.image
    this.cubeMap.images[4] = t.pz.image
    this.cubeMap.images[5] = t.nz.image
    this.cubeMap.needsUpdate = true

    this.scene.fog = new Fog(this.params.fog.color, this.params.fog.near, this.params.fog.far)
    this.scene.background = new Color(0x010218)
  }

  switchHDRI(string) {
    if (string === 'space') {
      this.scene.background = this.cubeMap
      this.space = false
    } else {
      this.scene.background = new Color(0x010218)
      this.space = true
    }
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputEncoding = sRGBEncoding

    this.renderer.setClearColor(0x212121, 1)

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    this.sizes.on('resize', () => {
      this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    })
  }

  setRenderer() {
    this.composer = new EffectComposer(this.renderer)
    this.activeCam = this.camera.camera
    this.renderPass = new RenderPass(this.scene, this.activeCam)
    this.renderer.switchCam = cam => {
      if (cam == 'default') this.activeCam = this.camera.camera
      else this.activeCam = cam
      this.composer.passes[0].camera = this.activeCam
      this.renderPass.camera = this.activeCam
    }
    this.composer.addPass(this.renderPass)

    this.myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: this.counter },
      },
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
    }

    const customPass = new ShaderPass(this.myEffect)
    customPass.renderToScreen = true
    this.composer.addPass(customPass)

    let lutMap
    let lutPass = new LUTPass()

    new LUTCubeLoader().load('lut/WGFX_Luts_23.cube', result => {
      lutMap = result
      lutPass.lut = lutMap.texture
      lutPass.intensity = 0.2
      this.composer.addPass(lutPass)
    })

    this.time.on('tick', () => {
      this.counter += 0.001
      if (!this.lut) {
        this.composer.removePass(lutPass)
      }
      customPass.uniforms['amount'].value = this.counter
      this.composer.render()
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.open()
      this.lut = { activated: true }
      folder
        .add(this.lut, 'activated')
        .name('lut')
        .listen()
        .onChange(() => {
          if (this.lut) {
            this.composer.addPass(lutPass)
            this.lut = false
          } else {
            this.composer.removePass(lutPass)
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
      debug: this.debug,
    })
    this.scene.add(this.starship.container)
  }

  setMars() {
    this.mars = new Mars({
      time: this.time,
      assets: this.assets,
      world: this.world,
      debug: this.debug,
    })
    this.scene.add(this.mars.container)
  }

  setEarth() {
    this.earth = new Earth({
      time: this.time,
      assets: this.assets,
      debug: this.debug,
    })
    this.scene.add(this.earth.container)
  }
  setCamera() {
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
      mouse: this.mouse,
      assets: this.assets,
      scene: this.scene,
    })
    this.time.on('tick', () => {
      this.camera.orbitControls.update()
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
      mars: this.mars,
      earth: this.earth,
      renderer: this.renderer,
      switchHDRI: this.switchHDRI,
    })
    this.scene.add(this.world.container)
  }

  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Fog')
      this.debugFolder.open()
      this.debugFolder
        .addColor(this.params.fog, 'color')
        .name('Color')
        .onChange(() => {
          this.scene.fog.color = new Color(this.params.color)
        })
      this.debugFolder.add(this.scene.fog, 'far').step(1).min(0).max(100).name('Far')
      this.debugFolder.add(this.scene.fog, 'near').step(0.1).min(0).max(10).name('Near')
    }
  }
}
