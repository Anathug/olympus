import { Object3D, DirectionalLight, Color } from 'three'

export default class DirectionalLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug
    // Set up
    this.position = options.position
    this.color = options.color

    this.container = new Object3D()
    this.container.name = options.name

    this.createDirectionalLight()

    if (this.debug) {
      this.setDebug()
    }
  }
  createDirectionalLight() {
    this.light = new DirectionalLight(this.color, 1)
    this.light.position.set(this.position.x, this.position.y, this.position.z)
    this.container.add(this.light)
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder(`${this.container.name} Light`)
    this.debugFolder.open()
    // this.debugFolder
    //   .addColor(this.color, 'color')
    //   .name('Color')
    //   .onChange(() => {
    //     this.light.color = new Color(this.color)
    //   })
    this.debugFolder.add(this.light.position, 'x').min(-50).max(50).name('Position X')
    this.debugFolder.add(this.light.position, 'y').min(-50).max(50).name('Position Y')
    this.debugFolder.add(this.light.position, 'z').min(-50).max(50).name('Position Z')
  }
}
