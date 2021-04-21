import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock } from 'three'

let c = new Chapter(1)
let updateThrusters = false
const startButton = document.querySelector('.chapter_1 button')
let clock = new Clock()

c.init = (options) => {
  hideChapterHtml()
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
  c.objects.push(c.starship.container)
  c.objects.push(c.mars.container)

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
  showChapterHtml()
  setEvents()
  c.starship.createStarship()
  c.starship.createThrusters()
  c.starship.container.position.set(0, 0, 0)
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
  c.starship.container.rotation.y += 0.001
  if (updateThrusters) {
    c.starship.container.position.y = clock.getElapsedTime()
    c.starship.thrusters.update()
  }
}

c.end = () => {
  removeEvents()
  hideChapterHtml()
  c.starship.thrusters.renderers[0].container.clear()
  c.starship.thrusters.destroy()
  updateThrusters = false
  c.objects.forEach(object => {
    object.visible = false
  });
}

const setEvents = () => {
  startButton.addEventListener('click', launchStarship)
}

const removeEvents = () => {
  startButton.removeEventListener('click', launchStarship)
}

const launchStarship = () => {
  clock.start()
  updateThrusters = true
}

const showChapterHtml = () => {
  const chapter1 = document.querySelector('.chapter_1')
  chapter1.style.display = 'block'
}

const hideChapterHtml = () => {
  const chapter1 = document.querySelector('.chapter_1')
  chapter1.style.display = 'none'
}

export default c;
