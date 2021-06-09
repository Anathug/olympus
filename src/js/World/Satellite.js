import { Object3D } from 'three'

export default class Satellite {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'Satellite'

    this.createSatellite()
  }
  createSatellite() {
    this.satellite = this.assets.models.satellite.scene
    this.container.add(this.satellite)
  }

}
