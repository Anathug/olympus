import Chapter from '../Chapter'
import { BoxGeometry, MeshNormalMaterial, Mesh } from 'three'
import Starship from '../world/Starship'
let c = new Chapter(2)

c.init = (options) => {
    c.world = options.world
    c.starship = new Starship({
        time: options.time,
        assets: options.assets,
        world: options.world
    })

    c.objects.push(c.starship)

    c.world.container.add(c.starship.container)
    c.objects.forEach(o => {
        o.container.visible = false
    });
}

c.start = () => {
    c.objects.forEach(o => {
        o.container.visible = true
    });
}

c.update = () => {
    c.starship.container.position.x = c.progress * 48 - 24
}

c.end = () => {
    c.objects.forEach(o => {
        o.container.visible = false
    });
}

export default c;
