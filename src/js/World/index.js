import { AxesHelper, Object3D } from 'three'

import AmbientLightSource from './AmbientLight'
import PointLightSource from './PointLight'
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
    this.mars = options.mars
    this.starship = options.starship
    this.container = new Object3D()
    this.container.name = 'World'
    this.init()

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

  }
  init() {
    this.setChapterHandler()
    this.setAmbientLight()
    //this.setPointLight()
    //this.setAmbientLight()
    this.setPointLight()
  }
  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.ambientlight.container)
  }
  setPointLight() {
    this.light = new PointLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }

  setChapterHandler() {
    this.ChapterHandler = new ChapterHandler({
      time: this.time,
      assets: this.assets,
      world: this,
      debug: this.debugFolder,
      renderer: this.renderer,
      scene: this.scene,
      mars: this.mars,
      earth: this.earth,
      starship: this.starship
    })
  }
}
