import Chapter from '../Chapter'
import { AnimationMixer, LoopRepeat, AmbientLight, Color } from 'three'

let c = new Chapter(1)
c.title = 'Step A01'
c.subtitle = 'Pre-launch countdown'
c.timelineColor = '#2ecc71'

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.activecam = 0
  c.firstIndexCamera = 0
  c.cams = []
  c.allowMouseMove = false
  c.time = 0
  createGltf()
  createGltfCams()
  createAnimation()
  createLights()
  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_1')
  c.showObjects(c.objects)
  c.createCams(c.cams)
  c.world.scene.background = new Color(0x010218)
  initActiveCamera(c.firstIndexCamera)
  c.allowMouseMove = true
}

c.update = () => {
  c.mixer.setTime(c.time * c.animationDuration)
  c.time += 0.001
}

c.end = () => {
  c.hideChapter('chapter_1')
  c.hideObjects(c.objects)
  c.deleteCams()
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap01
  console.log(c.gltf.scene)
  c.gltf.scene.traverse(child => {
    if (child.isMesh === true) {
      child.material.transparent = true
    }
  })
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
}

const createAnimation = () => {
  const clips = c.assets.models.animations.chap01.animations
  c.mixer = new AnimationMixer(c.gltf.scene)
  c.animationDuration = 0
  clips.forEach(clip => {
    c.mixer.clipAction(clip).setLoop(LoopRepeat)
    c.mixer.clipAction(clip).reset().play()
    if (clip.duration > c.animationDuration) c.animationDuration = clip.duration
  })
  clips.forEach(clip => {
    clip.duration = c.animationDuration
  })
}

const createGltfCams = () => {
  c.gltf.scene.traverse(object => {
    if (object.isCamera) {
      c.cams.push(object)
    }
  })
}

const createLights = () => {
  const light = new AmbientLight(0x000000, 2)
  light.position.set(0, 5, 2.5)
  c.world.container.add(light)
  c.objects.push(light)
}

const initActiveCamera = i => {
  c.cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  c.cameraButtons[i].classList.add('is-active')
  c.world.renderer.switchCam(c.cams[i])
}

export default c
