import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, DirectionalLight } from 'three'

let c = new Chapter(2)

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.allowScroll = true
  c.autoScroll = true
  c.allowMouseMove = false
  c.firstIndexCamera = 1
  c.cams = []
  c.directionalLights = [
    {
      name: 'firstDirectionalLightSource',
      position: {
        x: -30,
        y: 10,
        z: 0,
        intensity: 0.5,
      },
    },
    {
      name: 'secondDirectionalLightSource',
      position: {
        x: 50,
        y: 10,
        z: -45,
        intensity: 1.5,
      },
    },
    {
      name: 'thirdDirectionalLightSource',
      position: {
        x: 50,
        y: 10,
        z: 45,
        intensity: 1.5,
      },
    },
  ]
  createGltf()
  createGltfCams()
  createAnimation()
  createLights()

  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_2')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[c.firstIndexCamera])
  c.createCams(c.cams)
  c.switchHDRI()
  initActiveClassCamera(c.firstIndexCamera)
}

c.update = () => {
  c.mixer.setTime(c.progress * c.animationDuration)
}

c.end = () => {
  c.hideChapter('chapter_2')
  c.hideObjects(c.objects)
  c.deleteCams()
  c.allowScroll = false
  c.world.renderer.switchCam('default')
  c.switchHDRI('space')
}

const createGltfCams = () => {
  c.gltf.scene.traverse(object => {
    if (object.isCamera) c.cams.push(object)
  })
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap02
  console.log(c.gltf)
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
}

const createAnimation = () => {
  const clips = c.assets.models.animations.chap02.animations
  c.mixer = new AnimationMixer(c.gltf.scene)
  c.animationDuration = 0
  clips.forEach(clip => {
    c.mixer.clipAction(clip).setLoop(LoopOnce)
    c.mixer.clipAction(clip).reset().play()
    if (clip.duration > c.animationDuration) c.animationDuration = clip.duration
  })
  clips.forEach(clip => {
    clip.duration = c.animationDuration
  })
}

const createLights = () => {
  c.directionalLights.forEach(directionalLight => {
    const light = new DirectionalLight(directionalLight.color, directionalLight.intensity)
    light.position.set(
      directionalLight.position.x,
      directionalLight.position.z,
      directionalLight.position.z
    )
    c.world.container.add(light)
    c.objects.push(light)
  })
}

const initActiveClassCamera = i => {
  const cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  cameraButtons[i].classList.add('is-active')
}

export default c
