import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock } from 'three'
import gsap from 'gsap'

let c = new Chapter(1)
let updateThrusters = false
const startButton = document.querySelector('.chapter_1 button')
let clock = new Clock()

c.init = (options) => {
  hideChapterHtml()
  c.camera = options.world.camera.camera
  c.mouse = c.world.mouse.mouse
  c.debug = options.debug
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
  c.allowScroll = false

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
  c.starship.container.visible = true
  c.starship.createStarship()
  c.starship.createThrusters()
  c.starship.container.position.set(0, 0, 0)
  c.objects.forEach(object => {
    object.visible = true
  })
}

c.update = () => {
  if (!c.debug) {
    mouseMove(c.camera)
  }
  if (updateThrusters) {
    c.starship.container.position.y = clock.getElapsedTime()
    c.starship.thrusters.update()
  }
}

c.end = () => {
  removeEvents()
  hideChapterHtml()
  removeStarship()
  c.allowScroll = false
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

const mouseMove = (camera) => {
  gsap.to(camera.position, {
    x: c.mouse.x * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    y: c.mouse.x / 6,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.to(camera.position, {
    y: c.mouse.y * 2,
    duration: 2,
    ease: 'power3.out'
  })

  gsap.to(camera.rotation, {
    x: -c.mouse.y / 6,
    duration: 1,
    ease: 'power3.out'
  })
}

const removeStarship = () => {
  c.starship.thrusters.renderers[0].container.clear()
  c.starship.thrusters.destroy()
  updateThrusters = false
}

const launchStarship = () => {
  clock.start()
  c.allowScroll = true
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
