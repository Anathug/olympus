import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, AmbientLight, Object3D, Vector3 } from 'three'
import ParticleSystem from '../World/Thruster'
import lerp from '../Tools/Lerp'
import SoundHandler from '../Tools/SoundHandler'

let c = new Chapter(4)
c.title = 'Step c01'
c.subtitle = 'the journey to mars'
c.timelineColor = '#e74c3c'

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

  c.particleSystemContainer = new Object3D()
  c.gltf.scene.children[3].add(c.particleSystemContainer)
  c.particleSystemContainer.position.y -= 0

  c.particleSystem = new ParticleSystem({
    parent: c.particleSystemContainer,
    camera: c.cams[0],
    assets: c.assets,
    offset: new Vector3(0, 0.02, 0),
    scale: 0.03
  });

  c.soundHandler = new SoundHandler('./sounds/chap04.mp3', './sounds/chap04_r.mp3')
  c.ready = 0
  c.soundHandler.soundN.once('load', function () {
    c.ready++
    if (c.ready == 2)
      c.handler.trySetup()
  });
  c.soundHandler.soundR.once('load', function () {
    c.ready++
    if (c.ready == 2)
      c.handler.trySetup()
  });
}

c.start = () => {
  c.showChapter('chapter_4')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[c.firstIndexCamera])

  c.duration = c.soundHandler.duration
  c.handler.setAutoScrollSpeed(c.duration)
  c.soundHandler.start(c.progress)
  c.switchHDRI('landing-zone')
  c.changeFog(10, 0, c.marscColor)
  c.createCams(c.cams)
  initActiveClassCamera(c.firstIndexCamera)
  c.oldProg = c.progress
}

c.update = () => {
  c.soundHandler.update(c.progress)
  c.mixer.setTime(c.progress * c.animationDuration)

  if (c.progress < 0.2)
    c.handler.updateTimelineDisplay('Step C01', 'the journey to mars')
  else if (c.progress < 0.95)
    c.handler.updateTimelineDisplay('Step C02', 'landing of olympus on the martian surface')
  else
    c.handler.updateTimelineDisplay('Step C03', 'olympus III touchdown')


  c.particleSystem.Step((Math.min(Math.max(c.progress, 0), 1) - Math.min(Math.max(c.oldProg, 0), 1)) * lerp(50, 5, c.progress))
  c.oldProg = c.progress

}

c.end = () => {
  c.soundHandler.update(c.progress)
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
    const light = new AmbientLight(directionalLight.color, directionalLight.intensity)
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
