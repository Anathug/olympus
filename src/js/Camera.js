import { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

export default class Camera {
  constructor(options) {
    // Set Options
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Camera'

    this.camera = null

    this.setCamera()
    this.setPosition()
    this.mouseMove = this.mouseMove.bind(this)
    window.addEventListener('mousemove', this.mouseMove)
    // this.setOrbitControls()
  }
  setCamera() {
    this.camera = new PerspectiveCamera(
      45,
      this.sizes.viewport.width / this.sizes.viewport.height,
      0.1,
      1000
    )
    this.container.add(this.camera)
    this.sizes.on('resize', () => {
      this.camera.aspect = this.sizes.viewport.width / this.sizes.viewport.height
      this.camera.updateProjectionMatrix()
    })
  }
  setPosition() {
    // Set camera position
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 5
  }
  setOrbitControls() {
    // Set orbit control
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbitControls.enabled = false
    this.orbitControls.enableKeys = true
    this.orbitControls.zoomSpeed = 1

    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder.open()
      this.debugFolder.add(this.orbitControls, 'enabled').name('Enable Orbit Control')
    }
  }
  mouseMove(e) {
    let mouseX = e.clientX / window.innerWidth - 0.5
    let mouseY = e.clientY / window.innerHeight - 0.5

    gsap.to(this.camera.position, {
      x: mouseX * 2,
      duration: 0.6,
      ease: 'power3.out'
    })

    gsap.to(this.camera.rotation, {
      y: -mouseX / 5,
      duration: 0.6,
      ease: 'power3.out'
    })

    gsap.to(this.camera.position, {
      y: -mouseY * 2,
      duration: 0.6,
      ease: 'power3.out'
    })

    gsap.to(this.camera.rotation, {
      x: -mouseY / 5,
      duration: 0.6,
      ease: 'power3.out'
    })
  }
}
