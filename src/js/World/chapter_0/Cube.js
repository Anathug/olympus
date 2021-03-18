import { Object3D, BoxGeometry, MeshNormalMaterial, Mesh, Color } from 'three'
import gsap from 'gsap'

export default class Cube {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Cube'
    this.params = { color: 0x232323 }
    this.scrolled = 0
    this.normalizedScroll = 0
    this.tl = null
    this.createCube()
    this.animateCube()
    this.setWheel()
    if (this.debug) {
      this.setDebug()
    }
  }
  createCube() {
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshNormalMaterial()
    this.cube = new Mesh(geometry, material)
    this.container.add(this.cube)
  }
  animateCube() {
    this.tl = gsap.timeline({ paused: true })
    this.tl.to(this.cube.position, { x: 3, duration: 1 })
    this.tl.to(this.cube.position, { y: 3, duration: 1 })
    this.tl.to(this.cube.position, { x: -3, duration: 1 })
    this.tl.to(this.cube.position, { y: -3, duration: 1 })
    this.tl.to(this.cube.position, { x: 3, duration: 1 })
  }

  setWheel() {
    window.addEventListener('mousewheel', e => this.animProgress(e))
  }

  animProgress(e) {
    this.normalizedScroll = gsap.utils.clamp(0, 100, (this.scrolled += Math.sign(e.deltaY))) / 100
    gsap.to(this.tl, {
      progress: this.normalizedScroll,
      duration: 0.3,
    })
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Cube')
    this.debugFolder.open()
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.cube.color = new Color(this.params.color)
      })
  }
}
