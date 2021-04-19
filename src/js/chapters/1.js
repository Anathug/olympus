import Chapter from '../Chapter'
import Starship from '../World/Starship.js'
import Launcher from '../World/Launcher'

let c = new Chapter(1)

c.init = (options) => {
  c.world = options.world
  c.starship = new Starship({
    time: options.time,
    assets: options.assets,
    world: options.world,
    debug: options.debug
  })
  c.objects.push(c.starship)
  c.world.container.add(c.starship.container)

  c.launcher = new Launcher({
    time: options.time,
    assets: options.assets,
    world: options.world
  })
  c.objects.push(c.launcher)
  c.world.container.add(c.launcher.container)

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
  c.starship.container.position.y = c.progress * 48 - 24
  c.starship.container.rotation.y += 0.001
  c.starship.thrusters.update()
}

c.end = () => {
  c.objects.forEach(o => {
    o.container.visible = false
  });
}

export default c;
