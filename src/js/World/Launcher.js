import { Object3D } from 'three'

export default class Launch {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Launcher'
    this.params = {
      scale: 0.02
    }

    this.createLauncher()
    this.setScale()
    this.setPosition()
    if (this.debug) {
      this.setDebug()
    }

  }
  createLauncher() {
    this.launcher = this.assets.models.launcher.scene
    this.container.add(this.launcher)
  }

  setScale() {
    this.container.scale.set(this.params.scale, this.params.scale, this.params.scale);
  }
  setPosition() {
    this.container.scale.set(0.2, 0.2, 0.2)
    this.launcher.position.y = -3.3
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Launcher')
    this.debugFolder.open()
    this.debugFolder
      .add(this.launcher.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.launcher.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.launcher.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
    this.debugFolder
      .add(this.params, 'scale')
      .step(0.001)
      .min(0)
      .max(0.2)
      .name('Scale')
      .onChange(() => {
        this.container.scale.x = this.params.scale
        this.container.scale.y = this.params.scale
        this.container.scale.z = this.params.scale
      })
  }
}
