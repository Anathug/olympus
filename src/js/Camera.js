import { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Camera {
  constructor(options) {
    this.sizes = options.sizes
    this.renderer = options.renderer
    this.debug = options.debug
    this.mouse = options.mouse.mouse
    this.assets = options.assets
    this.scene = options.scene

    this.container = new Object3D()
    this.container.name = 'Camera'

    this.camera = null

    this.setCamera()
    this.setPosition()
    this.setOrbitControls()
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
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    )
    this.orbitControls.enabled = true
    this.orbitControls.enableKeys = true
    // this.orbitControls.enableZoom = false
    this.orbitControls.enablePan = false

    this.orbitControls.minPolarAngle = Math.PI / 3
    this.orbitControls.maxPolarAngle = Math.PI / 2

    this.orbitControls.enableDamping = true
    this.orbitControls.dampingFactor = 0.05

    this.orbitControls.autoRotate = true
    this.orbitControls.autoRotateSpeed = 0.2

    this.orbitControls.target.set(0, 0, 0)
    // this.camera.lookAt(0, 0, 0)

    this.orbitControls.saveState()


    if (this.debug) {
      this.debugFolder = this.debug.addFolder('Camera')
      this.debugFolder.open()
      this.debugFolder.add(this.orbitControls, 'enabled').name('Enable Orbit Control')
    }
  }
}
