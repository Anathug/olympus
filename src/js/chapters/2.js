import Chapter from '../Chapter'
import { BoxGeometry, MeshNormalMaterial, Mesh } from 'three'
let c = new Chapter(2)

c.init = () => {
    // console.log(objects)
    c.geometry = new BoxGeometry(1, 1, 1)
    c.material = new MeshNormalMaterial()
    c.cube = new Mesh(c.geometry, c.material)
    c.world.container.add(c.cube)
    c.objects.push(c.cube)
    c.objects.forEach(o => {
        o.visible = false
    });
}

c.start = () => {
    console.log("started 2")
    console.log(c.cube)
    c.cube.visible = true
}

c.update = () => {
    c.cube.position.x = c.progress * 16 - 8
}

c.end = () => {
    c.objects.forEach(o => {
        o.visible = false
    });
}

export default c;
