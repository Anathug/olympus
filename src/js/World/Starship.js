import * as THREE from 'three'
import { MeshStandardMaterial } from 'three'
import { Object3D, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'

export default class Starship {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.visible = false

    this.container.name = 'Starship'
    this.params = {
      scale: 0.02,
    }

    this.createStarship = this.createStarship.bind(this)
    this.createStarship()
    this.setScale()
    if (this.debug) {
      this.setDebug()
    }
  }
  createStarship() {
    this.starship = this.assets.models.starship.scene
    this.starship.scale.set(10, 10, 10)
    this.setMaterial()
    this.container.add(this.starship)
  }

  setMaterial() {
    const starshipTexture = this.assets.textures.global.starship
    const colorTexture = starshipTexture.MetalPlates007_1K_Color
    const displacementTexture = starshipTexture.MetalPlates007_1K_Displacement
    const metalnessTexture = starshipTexture.MetalPlates007_1K_Metalness
    const roughnessTexture = starshipTexture.MetalPlates007_1K_Roughness
    const normalTexture = starshipTexture.MetalPlates007_1K_Normal

    const truc = this.starship.children[13].children[0]

    truc.material = new MeshStandardMaterial({ map: colorTexture })
    truc.material.metalnessMap = metalnessTexture
    truc.material.roughnessMap = roughnessTexture

    // this.starship.children[13].traverse((child) => {
    //   console.log(child.material)
    //   child.material = new MeshBasicMaterial({ map: colorTexture })
    //   // child.material.map = colorTexture
    // })
    this.starship.traverse(child => {
      if (child.type === 'Mesh') {
        child.material.side = THREE.DoubleSide
        // child.material.displacementMap = displacementTexture
        // child.material.normalMap = normalTexture
        // child.material.metalnessMap = metalnessTexture
        // child.material.roughnessMap = roughnessTexture
      }
    })
  }
  setScale() {
    this.container.scale.set(this.params.scale, this.params.scale, this.params.scale)
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Starship')
    this.debugFolder.open()
    this.debugFolder.add(this.starship.position, 'x').step(0.1).min(-5).max(5).name('Position X')
    this.debugFolder.add(this.starship.position, 'y').step(0.1).min(-5).max(5).name('Position Y')
    this.debugFolder.add(this.starship.position, 'z').step(0.1).min(-5).max(5).name('Position Z')
    this.debugFolder
      .add(this.params, 'scale')
      .step(0.001)
      .min(0)
      .max(0.2)
      .name('Scale')
      .onChange(() => {
        this.container.scale.x = this.params.scale
        this.container.scale.y = this.params.scale
        this.container.scale.z = this.params.scale
      })
  }
}
