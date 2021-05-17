import * as THREE from 'three'
import { MeshStandardMaterial } from 'three';
import { Object3D, SphereGeometry, MeshBasicMaterial, Mesh } from 'three'
import ParticleSystem, {
  Body,
  BoxZone,
  Emitter,
  Color,
  Life,
  Mass,
  Alpha,
  Gravity,
  Repulsion,
  VectorVelocity,
  MeshRenderer,
  RandomDrift,
  Position,
  Force,
  Rate,
  Rotate,
  Scale,
  Span,
  Vector3D,
} from 'three-nebula';

export default class Starship {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Starship'
    this.params = {
      scale: 0.02
    }

    this.createStarship = this.createStarship.bind(this)
    this.createThrusters = this.createThrusters.bind(this)
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
  createThrusters() {
    const createEmitter = ({ position, size, body }) => {
      const emitter = new Emitter();

      return emitter
        .setRate(new Rate(1, 0.1))
        .addInitializers([
          new Mass(1),
          new Life(5),
          new Body(body),
          new VectorVelocity(new Vector3D(0, -50, 0), 10)
        ])
        .addBehaviours([
          new Rotate('random', 'random'),
          new Scale(7 * size, 20 * size),
          new Color('#ffd436', '#300500'),
          //new Color('#300500', '#000000', 0),
          new RandomDrift(0.2, 0, 0.5),
          //new Force(0, -0.2, 0),

          new Alpha(1, 0)
        ])
        .setPosition(position)
        .emit();
    };

    const mesh = this.assets.models.cloud.scene.children[0]//new Mesh(new SphereGeometry(10, 8, 8), new MeshToonMaterial({ color: '#ffd436', emissive: '#300500', transparent: true }))
    mesh.material.transparent = true
    const system = new ParticleSystem();
    const thrustersEmitter1 = createEmitter({
      position: {
        x: 0, y: 5, z: 0,
      },
      size: 0.8,
      body: mesh,
    });

    const thrustersEmitter2 = createEmitter({
      position: {
        x: 0, y: 5, z: 16.8
      },
      size: 0.5,
      body: mesh,
    });

    const thrustersEmitter3 = createEmitter({
      position: {
        x: 0, y: 5, z: -16.8,
      },
      size: 0.5,
      body: mesh,
    });

    this.thrusters = system
      .addEmitter(thrustersEmitter1)
      .addEmitter(thrustersEmitter2)
      .addEmitter(thrustersEmitter3)
      .addRenderer(new MeshRenderer(this.container, THREE))
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
    this.starship.traverse((child) => {

      if (child.type === 'Mesh') {
        // child.material.displacementMap = displacementTexture
        // child.material.normalMap = normalTexture
        // child.material.metalnessMap = metalnessTexture
        // child.material.roughnessMap = roughnessTexture
      }
    })
  }
  setScale() {
    this.container.scale.set(this.params.scale, this.params.scale, this.params.scale);
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Starship')
    this.debugFolder.open()
    this.debugFolder
      .add(this.starship.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.starship.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.starship.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
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
