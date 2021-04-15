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

    // Set up
    this.container = new Object3D()
    this.container.name = 'Starship'

    this.createStarship()
    this.createThrusters()
    this.setScale()
    this.setPosition()


  }
  createStarship() {
    this.starship = this.assets.models.starship.scene
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
      size: 1,
      body: mesh,
    });

    const thrustersEmitter2 = createEmitter({
      position: {
        x: 0, y: 5, z: 16.8
      },
      size: 0.6,
      body: mesh,
    });

    const thrustersEmitter3 = createEmitter({
      position: {
        x: 0, y: 5, z: -16.8,
      },
      size: 0.6,
      body: mesh,
    });
    this.thrusters = system
      .addEmitter(thrustersEmitter1)
      .addEmitter(thrustersEmitter2)
      .addEmitter(thrustersEmitter3)
      .addRenderer(new MeshRenderer(this.container, THREE))
  }

  setScale() {
    this.container.scale.set(0.05, 0.05, 0.05);
  }
  setPosition() {
    this.container.rotation.z = -Math.PI / 2
  }

}
