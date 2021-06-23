import { Object3D, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class Mars {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Mars'

    this.createEarth()
    this.setEarth()

    if (this.debug) {
      this.setDebug()
    }
  }
  createEarth() {
    const texture = this.assets.textures.global.mars.mars
    const geometry = new SphereGeometry(5, 32, 32)
    const material = new MeshBasicMaterial({ map: texture })
    const sphere = new Mesh(geometry, material)
    this.container.add(sphere)
  }

  setEarth() {
    this.container.scale.set(15, 15, 15)
    this.container.position.set(6, -90, 0)
    this.container.rotation.x = Math.PI / 2
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Mars')
    this.debugFolder
      .add(this.container.position, 'x')
      .step(1)
      .min(-1000)
      .max(1000)
      .name('Position X')
    this.debugFolder
      .add(this.container.position, 'y')
      .step(1)
      .min(-1000)
      .max(1000)
      .name('Position Y')
    this.debugFolder
      .add(this.container.position, 'z')
      .step(0.1)
      .min(-1000)
      .max(1000)
      .name('Rotation Z')
    this.debugFolder.add(this.container.rotation, 'x').step(1).min(-4).max(4).name('Rotation X')
    this.debugFolder.add(this.container.rotation, 'y').step(0.1).min(-4).max(4).name('Rotation Y')
    this.debugFolder.add(this.container.rotation, 'z').step(0.1).min(-4).max(4).name('Position Z')
  }
}
