import Chapter from '../Chapter'
import { AnimationMixer, LoopRepeat, DirectionalLight, Color, Vector3, Object3D } from 'three'
import ParticleSystem from '../World/Thruster'
import SoundHandler from '../Tools/SoundHandler'
import clamp from '../Tools/Clamp'
import Earth from '../World/Earth.js'
import threeDecimals from '../Tools/Decimals'


let c = new Chapter(2)
c.title = 'Step A02'
c.subtitle = 'Pre-launch countdown'
c.timelineColor = '#2ecc71'

c.init = options => {
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.allowScroll = true
  c.autoScroll = true
  c.allowMouseMove = false
  c.firstIndexCamera = 0
  c.activeCam = 0
  c.cams = []
  c.directionalLights = [
    {
      name: 'firstDirectionalLightSource',
      position: {
        x: -30,
        y: 10,
        z: 0,
        intensity: 0.2,
      },
    },
    {
      name: 'secondDirectionalLightSource',
      position: {
        x: 50,
        y: 10,
        z: -45,
        intensity: 1,
      },
    },
    {
      name: 'thirdDirectionalLightSource',
      position: {
        x: 50,
        y: 10,
        z: 45,
        intensity: 1,
      },
    },
  ]
  createGltf()
  createGltfCams()
  createAnimation()
  createLights()
  createEarth(options)

  c.hideObjects(c.objects)

  c.soundHandler = new SoundHandler('./sounds/chap02.mp3', './sounds/chap02_r.mp3')
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

  c.particleSystem1Container = new Object3D()
  c.gltf.scene.children[7].add(c.particleSystem1Container)
  c.particleSystem1Container.position.y -= 0

  c.particleSystem1 = new ParticleSystem({
    parent: c.particleSystem1Container,
    camera: c.cams[0],
    assets: c.assets,
    offset: new Vector3(0, 0.02, 0),
  })

  c.particleSystem2Container = new Object3D()
  c.gltf.scene.children[18].add(c.particleSystem2Container)
  c.particleSystem2Container.position.y += 1

  c.particleSystem2 = new ParticleSystem({
    parent: c.particleSystem2Container,
    camera: c.cams[0],
    assets: c.assets,
    offset: new Vector3(0, 0.02, 0),
  })
  c.oldProg = 0


}

c.start = () => {
  c.soundHandler.start(c.progress)
  c.showChapter('chapter_2')
  c.showObjects(c.objects)
  c.lensflarePositionX = -263
  c.lensflarePositionY = -291
  c.lensflareContainer.getObjectByName('Lensflare').position.z = -30
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.duration = c.soundHandler.duration
  c.handler.setAutoScrollSpeed(c.duration)
  c.earth.container.visible = true
  c.createCams(c.cams)
  c.switchHDRI()
  c.changeFog(150, 10, 0x010218)
  initActiveCamera(c.firstIndexCamera)
  c.oldProg = c.progress
  c.globalInteractions.transitionTitle('ma bite sur un tatami')
}

c.update = () => {
  //steps both particle systems
  c.particleSystem1.Step((clamp(c.progress, 0.044, 0.3) - clamp(c.oldProg, 0.044, 0.3)) * 50, c.progress < 0.20)
  c.particleSystem2.Step((clamp(c.progress, 0.232, 0.6) - clamp(c.oldProg, 0.232, 0.6)) * 50, c.progress < 0.50)
  c.soundHandler.update(c.progress)
  c.lensflareContainer.getObjectByName('Lensflare').position.x = c.lensflarePositionX - c.progress * 100
  c.earth.container.rotation.y = 0.5 + c.progress


  if (0.16 > c.progress && c.progress > 0.15) {
    forceSwitchCam(0)
    showMovieLayout()
  }

  if (0.17 > c.progress && c.progress > 0.16) {
    hideMovieLayout()
    forceSwitchCam(1)
  }

  if (c.progress < 0.16) {
    c.disableCam(1)
    c.globalInteractions.updateDistanceLayout(0)
    c.globalInteractions.updateVelocityLayout(0)
  } else {
    c.enableCam(1)
    // mettre au moment ou ca décolle
    c.globalInteractions.updateDistanceLayout(threeDecimals((c.progress - 0.16) * 100000))
    c.globalInteractions.updateVelocityLayout(clamp(threeDecimals((c.progress - 0.16) * 100000), 0, 9999))
  }
  if (c.progress < 0.15)
    c.handler.updateTimelineDisplay('Step A02', 'Takeoff of the Olympus rocket')
  else if (c.progress < 0.2) {
    c.handler.updateTimelineDisplay('Step A03', 'Release of the boosters')
  } else if (c.progress < 0.3)
    c.handler.updateTimelineDisplay('Step A04', 'Release of the first stage')
  else {
    c.handler.updateTimelineDisplay('Step A05', 'Injection on a transit orbit to Mars')
  }
  c.oldProg = c.progress

  c.mixer.setTime(Math.min(c.progress * c.duration, c.animationDuration - 0.01))

  if (c.activeCam === 0) c.earth.container.position.y = -90 - c.progress * 20
  if (c.activeCam === 1) c.earth.container.position.y = -180 - c.progress * 30

  c.soundHandler.update(c.progress)

  c.changeFog(150 + c.progress * 500, 10 + c.progress * 500, 0x010218)
  c.world.scene.background.lerpColors(new Color(0x010218), new Color(0x000000), c.progress)
}

c.end = () => {
  c.hideChapter('chapter_2')
  c.hideObjects(c.objects)
  c.deleteCams()
  c.allowScroll = false
  c.world.renderer.switchCam('default')
  c.soundHandler.end()
}

const createGltfCams = () => {
  c.gltf.scene.traverse(object => {
    if (object.isCamera) c.cams.push(object)
  })
}

const createGltf = () => {
  c.gltf = c.assets.models.animations.chap02
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
}

const createAnimation = () => {
  const clips = c.assets.models.animations.chap02.animations
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

const createEarth = options => {
  c.earth = new Earth(options, '2')
  c.objects.push(c.earth.container)
  c.world.container.add(c.earth.container)
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

const hideMovieLayout = () => {
  const toplayout = document.querySelector('.movie-layout .top')
  const bottomlayout = document.querySelector('.movie-layout .bottom')

  toplayout.classList.add('is-leaving')
  bottomlayout.classList.add('is-leaving')
}

const showMovieLayout = () => {
  const toplayout = document.querySelector('.movie-layout .top')
  const bottomlayout = document.querySelector('.movie-layout .bottom')

  toplayout.classList.remove('is-leaving')
  bottomlayout.classList.remove('is-leaving')
}

export default c
