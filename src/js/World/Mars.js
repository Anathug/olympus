import { Object3D } from 'three'

export default class Mars {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets

    this.container = new Object3D()
    this.container.name = 'Mars'

    this.createMars()
    this.setScale()
    this.setPosition()
  }
  createMars() {
    this.mars = this.assets.models.mars.scene
    this.container.add(this.mars)
  }

  setScale() {
    this.container.scale.set(0.08, 0.08, 0.08);
  }
  setPosition() {
    //this.container.rotation.z = -Math.PI / 2
  }

}
