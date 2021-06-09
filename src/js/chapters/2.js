import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock, AnimationMixer, LoopOnce } from 'three'
import gsap from 'gsap'

let c = new Chapter(2)
let updateThrusters = false
let clock = new Clock()
const startButton = document.querySelector('.chapter_2 button')
const mixer = null

c.init = options => {
  c.camera = options.world.camera.camera
  c.mouse = c.world.mouse.mouse
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.starship = options.starship
  c.mars = options.mars
  c.allowScroll = false
  c.allowMouseMove = false
  c.mixer = new AnimationMixer(c.camera)

  c.launcher = new Launcher({
    time: options.time,
    assets: options.assets,
    world: options.world,
    debug: options.debug,
  })

  c.objects.push(c.launcher.container)
  c.world.container.add(c.launcher.container)

  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.showChapter('chapter_2')
  setEvents()
  c.starship.container.visible = true
  c.starship.createStarship()
  c.starship.createThrusters()
  c.starship.container.position.set(0, 0, 0)
  c.objects.forEach(object => {
    object.visible = true
  })
  chapterBegin()
}

c.update = () => {
  if (!c.debug && c.allowMouseMove) {
    // mouseMove(c.camera)
  }
  if (updateThrusters) {
    c.starship.container.position.y = clock.getElapsedTime()
    c.camera.position.y = clock.getElapsedTime()
    c.starship.thrusters.update()
  }
  c.mixer.setTime(c.progress * c.action._clip.duration)
}

c.end = () => {
  removeEvents()
  c.hideChapter('chapter_2')
  removeStarship()
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  })
}

const chapterBegin = () => {
  const animation = c.assets.models.animations.camlauncher.animations[0]
  c.action = c.mixer.clipAction(animation)
  c.action.clampWhenFinished = true
  c.action.setLoop(LoopOnce)
  c.action.play()
}

const setEvents = () => {
  startButton.addEventListener('click', launchStarship)
}

const removeEvents = () => {
  startButton.removeEventListener('click', launchStarship)
}

const mouseMove = camera => {
  gsap.to(camera.position, {
    x: -2 + c.mouse.x * 2,
    duration: 2,
    ease: 'power3.out',
  })

  gsap.to(camera.rotation, {
    y: -7.9 + c.mouse.x / 6,
    duration: 1,
    ease: 'power3.out',
  })

  gsap.to(camera.position, {
    y: 7 + c.mouse.y * 2,
    duration: 2,
    ease: 'power3.out',
  })

  gsap.to(camera.rotation, {
    x: -c.mouse.y / 6,
    duration: 1,
    ease: 'power3.out',
  })
}

const removeStarship = () => {
  c.starship.thrusters.renderers[0].container.clear()
  c.starship.thrusters.destroy()
  updateThrusters = false
}

const launchStarship = () => {
  clock.start()
  c.allowMouseMove = false
  c.allowScroll = true
  updateThrusters = true
}

export default c
