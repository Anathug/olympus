import * as THREE from 'three'
import { Object3D, SphereGeometry, MeshToonMaterial, Mesh } from 'three'
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
    // Options
    this.time = options.time
    this.assets = options.assets
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Starship'

    this.createEmitter = null
    this.emitter = null
    this.thrustersEmitter1 = null
    this.thrustersEmitter2 = null
    this.thrustersEmitter3 = null
    this.params = {
      particles: {
        left: {
          positionX: 0.5,
          positionY: -1.5,
          positionZ: 0.5,
          size: 20
        },
        middle: {
          positionX: 0,
          positionY: 5,
          positionZ: 8,
          size: 0.1
        },
        right: {
          positionX: 0,
          positionY: 5,
          positionZ: -8,
          size: 0.1
        },
      }
    }
    this.createStarship()
    this.createThrusters()
    this.setScale()
    if (this.debug) {
      this.setDebug()
    }
  }
  createStarship() {
    this.starship = this.assets.models.starship.scene
    this.starship.scale.set(10, 10, 10)
    this.container.add(this.starship)
  }
  createThrusters() {
    this.createEmitter = ({ position, size, body }) => {
      this.emitter = new Emitter();

      return this.emitter
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
    this.thrustersEmitter1 = this.createEmitter({
      position: {
        x: 0, y: 5, z: 0,
      },
      size: 0.8,
      body: mesh,
    });

    this.thrustersEmitter2 = this.createEmitter({
      position: {
        x: 0, y: 5, z: 16.8
      },
      size: 0.5,
      body: mesh,
    });

    this.thrustersEmitter3 = this.createEmitter({
      position: {
        x: 0, y: 5, z: -16.8,
      },
      size: 0.5,
      body: mesh,
    });

    this.thrusters = system
      .addEmitter(this.thrustersEmitter1)
      .addEmitter(this.thrustersEmitter2)
      .addEmitter(this.thrustersEmitter3)
      .addRenderer(new MeshRenderer(this.container, THREE))
  }

  setScale() {
    this.container.scale.set(0.02, 0.02, 0.02);
  }
  setDebug() {
    this.debugFolder = this.debug.addFolder('Starship')
      .addFolder('Reactor 1')
    this.debugFolder
      .add(this.thrustersEmitter1.position, 'x')
      .step(0.1)
      .min(-10)
      .max(10)
      .name('Position X')
    this.debugFolder
      .add(this.thrustersEmitter1.position, 'y')
      .step(0.1)
      .min(-10)
      .max(10)
      .name('Position Y')
    this.debugFolder
      .add(this.thrustersEmitter1.position, 'z')
      .step(0.1)
      .min(-10)
      .max(10)
      .name('Position Z')
  }
}
