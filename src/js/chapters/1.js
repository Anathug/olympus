import Chapter from '../Chapter'
import { AnimationMixer, LoopRepeat } from 'three'

let c = new Chapter(1)
c.title = 'Step A01'
c.subtitle = 'Pre-launch countdown'
c.timelineColor = '#2ecc71'

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.camera = options.world.camera.camera
  c.mouse = c.world.mouse.mouse
  c.activecam = 0
  c.firstIndexCamera = 0
  c.cams = []
  c.allowMouseMove = false
  createGltf()
  createGltfCams()
  createAnimation()
  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_1')
  c.showObjects(c.objects)
  c.createCams(c.cams)
  initActiveCamera(c.firstIndexCamera)
  setCameraPosition()
  c.allowMouseMove = true
}

c.update = () => {
  if (!c.debug && c.allowMouseMove) {
    // mouseMove(c.camera)
  }
}

c.end = () => {
  c.hideChapter('chapter_1')
  c.hideObjects(c.objects)
  c.deleteCams()
}

const setCameraPosition = () => {
  c.camera.position.set(0, 0.3, 1.3)
  c.camera.rotation.x = -0.1
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap01
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
      console.log(object);
      c.cams.push(object)
    }
  })
}


// const mouseMove = (camera) => {
//   gsap.to(camera.position, {
//     x: c.mouse.x / 5,
//     duration: 2,
//     ease: 'power3.out'
//   })
// }

const initActiveCamera = i => {
  c.cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  c.cameraButtons[i].classList.add('is-active')
  c.world.renderer.switchCam(c.cams[i])
}

export default c
