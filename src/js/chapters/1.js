import Chapter from '../Chapter'
import Launcher from '../World/Launcher'

let c = new Chapter(1)
let updateThrusters = false

c.init = (options) => {
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
  // c.earth = options.earth
  c.objects.push(c.starship.container)
  c.objects.push(c.mars.container)
  // c.objects.push(c.earth.container)

  c.launcher = new Launcher({
    time: options.time,
    assets: options.assets,
    world: options.world,
    debug: options.debug
  })
  c.objects.push(c.launcher.container)
  c.world.container.add(c.launcher.container)
  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.starship.createStarship()
  c.starship.createThrusters()
  c.objects.forEach(object => {
    object.visible = true
  })
  window.addEventListener('click', () => {
    updateThrusters = true
  })
}

c.update = () => {
  // c.starship.container.position.y = c.progress * 48 - 24
  c.starship.container.rotation.y += 0.001
  if (updateThrusters) {
    c.starship.thrusters.update()
  }
}

c.end = () => {
  c.starship.thrusters.renderers[0].container.clear()
  c.starship.thrusters.destroy()
  updateThrusters = false
  c.objects.forEach(object => {
    object.visible = false
  });
}

export default c;
