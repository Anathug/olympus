import { Object3D } from 'three'

export default class Earth {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets

    this.container = new Object3D()
    this.container.name = 'Earth'

    this.createEarth()
    this.setScale()
    this.setPosition()
  }
  createEarth() {
    this.earth = this.assets.models.earth.scene
    this.container.add(this.earth)
  }

  setScale() {
    this.container.scale.set(0.3, 0.3, 0.3);
  }
  setPosition() {
    //this.container.rotation.z = -Math.PI / 2
  }

}
