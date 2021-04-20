import Chapter from '../Chapter'
import Launcher from '../World/Launcher'

let c = new Chapter(1)

c.init = (options) => {
  c.world = options.world
  //global objects
  c.starship = options.starship
  c.mars = options.mars
  // c.earth = options.earth
  c.objects.push(c.starship.container)
  c.objects.push(c.mars.container)
  // c.objects.push(c.earth.container)

  //specific to chapter object
  c.launcher = new Launcher({
    time: options.time,
    assets: options.assets,
    world: options.world,
    debug: options.debug
  })
  c.objects.push(c.launcher.container)
  c.world.container.add(c.launcher.container)
  //make everything invisible at first
  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
  c.starship.container.position.y = c.progress * 48 - 24
  c.starship.container.rotation.y += 0.001
  c.starship.thrusters.update()
}

c.end = () => {
  c.objects.forEach(object => {
    object.visible = false
  });
}

export default c;
