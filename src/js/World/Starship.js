import { Object3D } from 'three'

export default class Starship {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'Starship'

    this.createStarship()
    this.setMovement()
  }
  createStarship() {
    this.starship = this.assets.models.starship.scene
    this.container.add(this.starship)
  }
  setMovement() {
    this.starship.scale.set(0.05, 0.05, 0.05);
    this.starship.rotation.z = -Math.PI / 2
    this.time.on('tick', () => {
      this.starship.rotation.x += 0.0005
    })
  }
}
