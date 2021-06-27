import { Scene, sRGBEncoding, WebGLRenderer, Color, CubeTexture, Fog, Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { LUTPass } from 'three/examples/jsm/postprocessing/LUTPass.js'
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js'
import * as Stats from 'stats.js'
import * as dat from 'dat.gui'

import Camera from './Camera'
import World from './World/index'

import Starship from './World/Starship.js'

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
      bloomPass: {
        exposure: 1,
        bloomStrength: 0.2,
        bloomThreshold: 0,
        bloomRadius: 0,
      },
    }

    this.counter = 0.0
    this.starship = null
    this.myEffect = null
    this.bloomPass = null
    this.lut = true
    this.composer = null
    this.spaceCubeMap = null
    this.landingZoneCubeMap = null
    this.stats = null

    this.postprocessing = true

    this.switchHDRI = this.switchHDRI.bind(this)
    this.changeFog = this.changeFog.bind(this)
    this.setConfig()
    this.setScene()
    this.setSpaceHdri()
    // this.setStarship()
    this.createRenderer()
    this.setCamera()
    this.setRenderer()
    this.setWorld()
  }

  setScene() {
    this.scene = new Scene()
    this.scene.fog = new Fog(this.params.fog.color, this.params.fog.near, this.params.fog.far)
  }

  setSpaceHdri() {
    this.spaceCubeMap = new CubeTexture()
    const t = this.assets.textures.hdri.space

    this.spaceCubeMap.images[0] = t.px.image
    this.spaceCubeMap.images[1] = t.nx.image
    this.spaceCubeMap.images[2] = t.py.image
    this.spaceCubeMap.images[3] = t.ny.image
    this.spaceCubeMap.images[4] = t.pz.image
    this.spaceCubeMap.images[5] = t.nz.image
    this.spaceCubeMap.needsUpdate = true
  }

  switchHDRI(string) {
    if (string === 'space') {
      this.scene.background = this.spaceCubeMap
    } else if (string === 'landing-zone') {
      this.scene.background = new Color(0xffd38a)
    } else {
      this.scene.background = new Color(0x010218)
    }
  }

  changeFog(far, near, color) {
    this.scene.fog.color = new Color(color)
    this.scene.fog.near = near
    this.scene.fog.far = far
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    window.addEventListener('resize', () => {
      this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
      this.activeCam.aspect = window.innerWidth / window.innerHeight
      this.activeCam.updateProjectionMatrix()
    })
  }

  setRenderer() {
    this.activeCam = this.camera.camera
    this.stats = new Stats()
    this.stats.showPanel(1)
    document.body.appendChild(this.stats.dom)
    if (this.postprocessing) {
      this.composer = new EffectComposer(this.renderer)
      this.renderPass = new RenderPass(this.scene, this.activeCam)
    }

    this.renderer.switchCam = cam => {
      if (cam == 'default') this.activeCam = this.camera.camera
      else this.activeCam = cam
      if (this.postprocessing) {
        this.composer.passes[0].camera = this.activeCam
        this.renderPass.camera = this.activeCam
      }
    }
    if (this.postprocessing) {
      this.composer.addPass(this.renderPass)
    }

    this.myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: this.counter },
      },
      vertexShader: postVertexShader,
      fragmentShader: postFragmentShader,
    }

    let customPass = null

    if (this.postprocessing) {
      customPass = new ShaderPass(this.myEffect)
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

      this.bloomPass = new UnrealBloomPass(
        new Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )
      this.bloomPass.threshold = this.params.bloomPass.bloomThreshold
      this.bloomPass.strength = this.params.bloomPass.bloomStrength
      this.bloomPass.radius = this.params.bloomPass.bloomRadius

      this.composer.addPass(this.bloomPass)
    }

    this.time.on('tick', () => {
      this.counter += 0.001
      this.stats.begin()
      if (this.postprocessing) {
        customPass.uniforms['amount'].value = this.counter
        this.composer.render()
      } else {
        this.renderer.render(this.scene, this.activeCam)
      }
      this.stats.end()
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
      changeFog: this.changeFog,
      bloomPass: this.bloomPass,
    })
    this.scene.add(this.world.container)
  }

  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
  }
}
