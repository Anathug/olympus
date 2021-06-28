import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, AmbientLight, Object3D, Vector3 } from 'three'
import ParticleSystem from '../World/Thruster'
import lerp from '../Tools/Lerp'

let c = new Chapter(4)
c.title = 'Step c01'
c.subtitle = 'the journey to mars'
c.timelineColor = '#e74c3c'

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.layout = document.querySelector('.experience-layout')
  c.credit = document.querySelector('.credit')
  c.creditButton = c.credit.querySelector('button')
  c.timeline = document.querySelector('#timelineDiv')
  c.cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  c.cameraButtonsWrapper = document.querySelector('.middle-right-wrapper')
  c.allowScroll = true
  c.autoScroll = true
  c.allowMouseMove = false
  c.firstIndexCamera = 1
  c.cams = []
  c.marscColor = 0xc6bc9b
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
  c.gltf.scene.children[6].add(c.particleSystemContainer)
  c.particleSystemContainer.position.y -= 0

  c.particleSystem = new ParticleSystem({
    parent: c.particleSystemContainer,
    camera: c.cams[0],
    assets: c.assets,
    offset: new Vector3(0, 0.02, 0),
    scale: 0.02
  });
}

c.start = () => {
  c.showChapter('chapter_4')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[c.firstIndexCamera])
  c.cameraButtonsWrapper.style.display = 'none'


  c.soundHandlers[c.index].start(c.progress)
  c.duration = c.soundHandlers[c.index].duration
  c.handler.setAutoScrollSpeed(c.duration)
  c.subtitlesHandlers[c.index].start(c.duration)


  c.switchHDRI('landing-zone')
  c.changeFog(10, 0, c.marscColor)
  c.createCams(c.cams)
  initActiveClassCamera(c.firstIndexCamera)
  initActiveCamera(c.firstIndexCamera)
  c.oldProg = c.progress
  c.lensflareContainer.visible = false
  c.bloomPass.strength = 0.1

}

c.update = () => {
  c.soundHandlers[c.index].update(c.progress)
  c.subtitlesHandlers[c.index].update(c.progress)
  c.mixer.setTime(c.progress * c.animationDuration)

  if (c.progress < 0.2)
    c.handler.updateTimelineDisplay('Step C01', 'the journey to mars')
  else if (c.progress < 0.95)
    c.handler.updateTimelineDisplay('Step C02', 'landing of olympus on the martian surface')
  else
    c.handler.updateTimelineDisplay('Step C03', 'olympus III touchdown')
  c.particleSystem.Step((Math.min(Math.max(c.progress, 0), 0.2) - Math.min(Math.max(c.oldProg, 0), 0.2)) * lerp(50, 5, c.progress), c.progress < 0.165)
  c.oldProg = c.progress

  if (0.20 > c.progress && c.progress > 0.19) {
    forceSwitchCam(0)
  }

  if (0.19 > c.progress && c.progress > 0.18) {
    forceSwitchCam(1)
  }

  if (c.progress > 0.19) {
    c.layout.classList.add('hidden')
    c.timeline.classList.add('hidden')
  } else {
    c.layout.classList.remove('hidden')
    c.timeline.classList.remove('hidden')
    c.credit.classList.remove('is-active')
  }
  if (c.progress > 0.20) {
    c.credit.classList.add('is-active')
    c.creditButton.classList.add('visible')
  } else {
    c.credit.classList.remove('is-active')
    c.creditButton.classList.remove('visible')
  }
}

c.end = () => {
  c.soundHandlers[c.index].update(c.progress)
  c.subtitlesHandlers[c.index].end()
  c.hideChapter('chapter_4')
  c.hideObjects(c.objects)
  c.deleteCams()
  c.allowScroll = false
  c.world.renderer.switchCam('default')
  c.cameraButtonsWrapper.style.display = 'block'
  c.bloomPass.strength = 0.2
}

const createGltfCams = () => {
  c.gltf.scene.traverse(object => {
    if (object.isCamera) c.cams.push(object)
  })
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap04
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
}

const createAnimation = () => {
  const clips = c.assets.models.animations.chap04.animations
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

const forceSwitchCam = i => {
  c.activeCam = i
  c.world.renderer.switchCam(c.cams[i])
  c.cameraButtons.forEach(cameraButton => cameraButton.classList.remove('is-active'))
  c.cameraButtons[i].classList.add('is-active')
}

const initActiveCamera = i => {
  c.cameraButtons = document.querySelectorAll('.middle-right-wrapper .camera-wrapper')
  c.cameraButtons[i].classList.add('is-active')
  c.world.renderer.switchCam(c.cams[i])
}


export default c
