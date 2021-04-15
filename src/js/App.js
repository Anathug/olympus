import { Scene, sRGBEncoding, WebGLRenderer } from 'three'
import * as dat from 'dat.gui'

import Sizes from './Tools/Sizes'
import Time from './Tools/Time'
import Assets from './Tools/Loader'

import Camera from './Camera'
import World from './World/index'

// import gsap from 'gsap'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
  }

  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set renderer
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
    this.time.on('tick', () => {

      if (!(this.renderOnBlur?.activated && !document.hasFocus())) {
        this.renderer.render(this.scene, this.camera.camera)
      }
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.open()
      folder.add(this.renderOnBlur, 'activated').name('Render on window blur')
    }
  }

  setCamera() {
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })

    this.scene.add(this.camera.container)
  }

  setWorld() {
    this.world = new World({
      time: this.time,
      debug: this.debug,
      assets: this.assets,
    })

    this.scene.add(this.world.container)
  }

  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
  }
}
