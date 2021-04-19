import { Object3D } from 'three'

export default class Launcher {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets

    this.container = new Object3D()
    this.container.name = 'Launcher'

    this.createLauncher()
    this.setScale()
    this.setPosition()


  }
  createLauncher() {
    this.starship = this.assets.models.launcher.scene
    this.container.add(this.starship)
  }

  setScale() {
    this.container.scale.set(0.02, 0.02, 0.02);
  }
  setPosition() {
    //this.container.rotation.z = -Math.PI / 2
  }

}
