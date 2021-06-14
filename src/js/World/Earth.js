import { Object3D, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class Earth {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets

    this.container = new Object3D()
    this.container.name = 'Earth'

    this.counter = 0

    this.createEarth()
    this.setScale()
  }
  createEarth() {
    const texture = this.assets.textures.global.earth.earth
    const geometry = new SphereGeometry(5, 32, 32)
    const material = new MeshBasicMaterial({ map: texture })
    const sphere = new Mesh(geometry, material)
    this.container.add(sphere)
  }

  setScale() {
    this.container.scale.set(0.8, 0.8, 0.8)
  }
}
