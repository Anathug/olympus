import { Object3D, BoxGeometry, MeshNormalMaterial, Mesh } from 'three'

export default class Cockpit {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Cockpit'
    this.params = {
      scale: 0.02
    }

    this.createCockpit = this.createCockpit.bind(this)
    this.createCockpit()
    this.setScale()
    if (this.debug) {
      this.setDebug()
    }
  }
  createCockpit() {
    this.cockpit = this.assets.models.cockpit.scene
    this.cockpit.scale.set(10, 10, 10)
    this.container.add(this.cockpit)
  }

  setScale() {
    this.container.scale.set(this.params.scale, this.params.scale, this.params.scale);
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('cockpit')
    this.debugFolder.open()
    this.debugFolder
      .add(this.cockpit.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.cockpit.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.cockpit.position, 'z')
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
