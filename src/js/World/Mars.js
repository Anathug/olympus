import { Object3D } from 'three'

export default class Mars {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Mars'
    this.params = {
      // scale: 0.08
      scale: 0
    }
    this.createMars()
    this.setScale()

    if (this.debug) {
      this.setDebug()
    }
  }
  createMars() {
    this.mars = this.assets.models.mars.scene
    this.container.add(this.mars)
  }

  setScale() {
    this.container.scale.set(this.params.scale, this.params.scale, this.params.scale);
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Mars')
    this.debugFolder.open()
    this.debugFolder
      .add(this.mars.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.mars.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.mars.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
    this.debugFolder
      .add(this.params, 'scale')
      .step(0.1)
      .min(0)
      .max(10)
      .name('Scale')
      .onChange(() => {
        this.container.scale.x = this.params.scale
        this.container.scale.y = this.params.scale
        this.container.scale.z = this.params.scale
      })
  }
}
