import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, AmbientLight } from 'three'

let c = new Chapter(6)

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.allowScroll = true
  c.autoScroll = true
  c.allowMouseMove = false
  c.firstIndexCamera = 0
  c.cams = []
  c.marscColor = 0xffd38a
  c.directionalLights = [
    {
      name: 'firstAmbientLight',
      position: {
        x: 0,
        y: 5,
        z: 0,
      },
      intensity: 12,
      color: 0x222222,
    },
  ]
  createGltf()
  createGltfCams()
  createAnimation()
  createLights()
  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_4')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[c.firstIndexCamera])
  c.switchHDRI('landing-zone')
  c.changeFog(10, 0, c.marscColor)
  c.createCams(c.cams)
  initActiveClassCamera(c.firstIndexCamera)
}

c.update = () => {
  c.mixer.setTime(c.progress * c.animationDuration)
}

c.end = () => {
  c.hideChapter('chapter_4')
  c.hideObjects(c.objects)
  c.deleteCams()
  c.allowScroll = false
  c.world.renderer.switchCam('default')
}

const createGltfCams = () => {
  c.gltf.scene.traverse(object => {
    if (object.isCamera) c.cams.push(object)
  })
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap06
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
}

const createAnimation = () => {
  const clips = c.assets.models.animations.chap06.animations
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

const initActiveClassCamera = i => {
  const cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  cameraButtons[i].classList.add('is-active')
}

const createLights = () => {
  c.directionalLights.forEach(directionalLight => {
    console.log(directionalLight)
    const light = new AmbientLight(directionalLight.color, directionalLight.intensity)
    console.log(light)
    light.position.set(
      directionalLight.position.x,
      directionalLight.position.z,
      directionalLight.position.z
    )
    c.world.container.add(light)
    c.objects.push(light)
  })
}

export default c
