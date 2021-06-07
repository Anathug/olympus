import { Object3D, BoxGeometry, MeshStandardMaterial, Mesh } from 'three'

export default class Background {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Background'
    this.params = { color: 0x000000 }
    this.mesh = null
    this.createBackground()
    if (this.debug) {
      this.setDebug()
    }
  }
  createBackground() {
    const geometry = new BoxGeometry(17, 17, 1)
    const material = new MeshStandardMaterial({ color: this.params.color })
    this.mesh = new Mesh(geometry, material)
    this.mesh.position.z = -1
    this.container.add(this.mesh)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Background')
    this.debugFolder.open()
    this.debugFolder
      .add(this.mesh.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.mesh.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.mesh.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
  }
}
