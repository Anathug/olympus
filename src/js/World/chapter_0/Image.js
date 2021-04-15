import { Object3D, PlaneBufferGeometry, MeshStandardMaterial, Mesh, TextureLoader } from 'three'
import gsap from 'gsap'
export default class Image {
  constructor(img, texture) {
    this.container = new Object3D()
    this.createImage = this.createImage.bind(this)
    this.setBounds = this.setBounds.bind(this)
    this.updateSize = this.updateSize.bind(this)
    this.mesh = null
    this.img = img
    this.texture = texture
    this.camUnit = 0
    this.material = null
    this.geometry = null
    this.textureLoader = new TextureLoader()
  }
  createImage(camera) {
    this.geometry = new PlaneBufferGeometry(1, 1, 32, 32)
    this.material = new MeshStandardMaterial({ map: this.texture })
    this.mesh = new Mesh(this.geometry, this.material)
    this.setBounds(camera)
    this.container.add(this.mesh)
    this.mesh.visible = false
  }
  setBounds(camera) {
    this.rect = this.img.getBoundingClientRect()
    this.bounds = {
      left: this.rect.left,
      top: this.rect.top,
      width: this.rect.width,
      height: this.rect.height,
    }
    this.updateSize(camera)
    this.updatePosition()
  }


  updateSize(camera) {
    this.camUnit = this.calculateUnitSize(camera.position.z - this.mesh.position.z, camera)

    const x = this.bounds.width / window.innerWidth
    const y = this.bounds.height / window.innerHeight

    if (!x || !y) return

    this.mesh.scale.x = this.camUnit.width * x
    this.mesh.scale.y = this.camUnit.height * y
  }

  calculateUnitSize(distance, camera) {
    const vFov = (camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(vFov / 2) * distance
    const width = height * camera.aspect

    return { width, height }
  }

  updateY(y = 0) {
    const { top, height } = this.bounds
    this.mesh.position.y = this.camUnit.height / 2 - this.mesh.scale.y / 2
    this.mesh.position.y -= ((top - y) / window.innerHeight) * this.camUnit.height
    this.progress = gsap.utils.clamp(0, 1, 1 - (-y + top + height) / (window.innerHeight + height))
  }

  updateX(x = 0) {
    const { left } = this.bounds
    this.mesh.position.x = -(this.camUnit.width / 2) + this.mesh.scale.x / 2
    this.mesh.position.x += ((left + x) / window.innerWidth) * this.camUnit.width
  }

  updatePosition(y) {
    this.updateY(y)
    this.updateX(0)
  }
}
