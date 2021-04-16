import { Object3D, BoxGeometry, Mesh, MeshStandardMaterial, TextureCube } from 'three'

export default class Sky {
    constructor(options) {
        // Options
        this.time = options.time
        this.assets = options.assets

        // Set up
        this.container = new Object3D()
        this.container.name = 'Sky'

        this.createSky()
        //this.setMovement()
    }
    createSky() {
        //const geometry = new BoxGeometry(1, 1, 1)

        const t = this.assets.textures
        console.log(t)
        let keys = Object.keys(this.assets.textures);
        console.log(keys)
        for (let i of keys) {
            console.log(i);
        }

        const textureCube = [
            t.px, t.nx,
            t.py, t.ny,
            t.pz, t.nz
        ]

        console.log(textureCube)

        //
        //
        //const material = new MeshStandardMaterial({
        //    map: textureCube
        //})
        //this.sky = new Mesh(geometry, material)
        //this.container.add(this.sky)
    }
    setMovement() {
        this.time.on('tick', () => {
            this.sky.rotation.x += 0.003
            this.sky.rotation.y += 0.005
        })
    }
}
