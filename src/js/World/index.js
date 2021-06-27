import { AxesHelper, Object3D, DirectionalLight, AmbientLight } from 'three'
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js'
import ChapterHandler from '../ChapterHandler'

export default class World {
  constructor(options) {
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.camera = options.camera
    this.mouse = options.mouse
    this.renderer = options.renderer
    this.scene = options.scene
    this.earth = options.earth
    this.starship = options.starship
    this.switchHDRI = options.switchHDRI
    this.changeFog = options.changeFog
    this.bloomPass = options.bloomPass
    this.soundHandlers = options.soundHandlers
    this.subtitlesHandlers = options.subtitlesHandlers
    this.container = new Object3D()
    this.container.name = 'World'
    this.lensflareLights = [
      { h: 0.995, s: 0.5, l: 0.9, x: -263, y: -291, z: -30 },
    ]
    this.lensflareContainer = new Object3D()
    this.dirLight = null

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }
    this.init()
  }
  init() {
    this.setChapterHandler()
    this.setLights()
  }

  setLights() {
    this.dirLight = new DirectionalLight(0xffffff, 0)
    this.dirLight.position.set(-1, 0, 0).normalize()
    this.dirLight.color.setHSL(0.1, 0.7, 0.5)
    this.lensflareContainer.add(this.dirLight)

    this.lensflareLights.forEach((lensflareLight, i) => {
      this.addLight(
        lensflareLight.h,
        lensflareLight.s,
        lensflareLight.l,
        lensflareLight.x,
        lensflareLight.y,
        lensflareLight.z,
        i
      )
    })

    this.ambiantLight = new AmbientLight(0xffffff, 0.2)
    this.container.add(this.ambiantLight)
    this.container.add(this.lensflareContainer)
  }

  addLight(h, s, l, x, y, z, index) {
    const light = new DirectionalLight(0xffffff, 1.5, 2000)
    // light.color.setHSL(h, s, l)
    light.position.set(x, y, z)
    light.name = 'Lensflare'
    this.lensflareContainer.add(light)

    const lensflare = new Lensflare()
    const textureFlare0 = this.assets.textures.global.lensflare.lensflare0
    const textureFlare3 = this.assets.textures.global.lensflare.lensflare3

    lensflare.addElement(new LensflareElement(textureFlare0, 1400, 0, light.color))
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6))
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7))
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9))
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1))
    light.add(lensflare)

    if (this.debug) {

      this.debugFolder = this.debug.addFolder(`Lensflare + ${index}`)
      this.debugFolder.open()
      this.debugFolder.add(light.position, 'x').step(1).min(-400).max(-200).name('Position X')
      this.debugFolder.add(light.position, 'y').step(1).min(-400).max(-200).name('Position Y')
      this.debugFolder.add(light.position, 'z').step(1).min(-5000).max(5000).name('Position Z')
      this.debugFolder.add(light.scale, 'x').step(0.1).min(0).max(3).name('Scale X')
      this.debugFolder.add(light.scale, 'y').step(0.1).min(0).max(3).name('Scale Y')
      this.debugFolder.add(light.scale, 'z').step(0.1).min(0).max(3).name('Scale Z')
    }
  }

  setChapterHandler() {
    this.ChapterHandler = new ChapterHandler({
      time: this.time,
      assets: this.assets,
      world: this,
      debug: this.debugFolder,
      renderer: this.renderer,
      mouse: this.mouse,
      scene: this.scene,
      mars: this.mars,
      earth: this.earth,
      starship: this.starship,
      switchHDRI: this.switchHDRI,
      changeFog: this.changeFog,
      lensflareContainer: this.lensflareContainer,
      bloomPass: this.bloomPass,
      soundHandlers: this.soundHandlers,
      subtitlesHandlers: this.subtitlesHandlers
    })
  }
}
