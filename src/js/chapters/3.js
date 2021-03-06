import Chapter from '../Chapter'
import { Vector3 } from 'three'
import Satellite from '../World/Satellite'
import lerp from '../Tools/Lerp'
import Earth from '../World/EarthBis.js'

let c = new Chapter(3)
c.title = 'Step B01'
c.timelineColor = '#F1C40F'

c.init = options => {
  c.camera = options.world.camera.camera
  c.controls = options.world.camera.orbitControls
  c.mouse = c.world.mouse.mouse
  c.debug = options.debug
  c.world = options.world
  c.starship = options.assets.models.starship.scene.children[0]
  c.world.container.add(c.starship)
  c.satellite = new Satellite(options)

  c.directionalLights = [
    {
      name: 'firstDirectionalLightSource',
      position: {
        x: -30,
        y: 10,
        z: 0,
        intensity: 2,
      },
    },
  ]
  c.world.container.add(c.starship)
  c.starship.visible = true
  c.starship.children[0].children.forEach(e => {
    e.visible = false
  })
  c.world.container.add(c.satellite.container)
  c.freeViewTime = 0.3
  c.transTime = 0.05
  c.travelTime = 0.4
  c.cameraTarget = new Vector3(0, 0, 0)
  c.time = 0
  c.objects.push(c.starship)
  c.objects.push(c.satellite.container)
  createEarth(options)
  c.objects.forEach(object => {
    object.visible = false
  })
  c.crosshair = document.getElementById('crosshair')
  c.circle = document.getElementById('circle')
  c.lastCamPos = new Vector3(0, 0, 0)
  c.circlePos = new Vector3(0, 0, 0)

  if (c.debug) {
    setDebug()
  }
}

c.start = () => {
  c.showChapter('chapter_3')
  c.lensflareContainer.getObjectByName('Lensflare').position.z = - 5000
  c.controls.enabled = true
  c.controls.autoRotate = true
  c.controls.autoRotateSpeed = 0.2
  c.camera.position.set(-10, 3, 40)
  c.starship.position.set(0, -0, -20)
  c.satellite.container.scale.set(1, 1, 1)
  // c.starship.scale.set(0.1, 0.1, 0.1)
  c.anchor = new Vector3(0, 0, 0)
  // (0, -4.5, -30) position d'arriver du satelite 
  c.satellite.container.position.set(-0, -3.45, -20)
  c.satellite.container.visible = true
  c.objects.forEach(object => {
    object.visible = true
  })
  c.starship.rotation.x = Math.PI / 2

  c.world.scene.fog.far = 2000
  c.switchHDRI('space')

  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'

  c.soundHandlers[c.index].start(c.progress)
  c.duration = c.soundHandlers[c.index].duration
  c.subtitlesHandlers[c.index].start(c.duration)
  c.handler.setAutoScrollSpeed(c.duration)
  c.lensflareContainer.visible = true

  c.earth.container.rotation.set(0.4, 3, 3.1)
}

c.update = () => {
  c.soundHandlers[c.index].update(c.progress)
  c.subtitlesHandlers[c.index].update(c.progress)
  if (c.progress < 0.75) c.handler.updateTimelineDisplay('Step B01', 'satellite docking')
  else c.handler.updateTimelineDisplay('Step B02', 'rendezvous with the refuelling satelLite')
  c.earth.container.rotation.y = 0.5 + c.progress / 3

  if (c.progress < c.freeViewTime) {
    c.controls.enabled = true
    c.controls.autoRotate = true
    c.lastCamPos = { ...c.camera.position }
    return
  }
  if (c.progress < c.freeViewTime + c.transTime) {
    c.controls.enabled = false
    c.controls.autoRotate = false
    let transProgress = (c.progress - c.freeViewTime) / c.transTime
    c.camera.position.lerpVectors(
      c.lastCamPos,
      new Vector3(0, 3, -15),
      -(Math.cos(Math.PI * transProgress) - 1) / 2
    )

    c.circle.style.visibility = 'hidden'
    c.crosshair.style.visibility = 'hidden'
    return
  }
  if (c.progress < c.freeViewTime + c.transTime + c.travelTime) {
    c.controls.enabled = false
    c.crosshair.style.visibility = 'visible'
    c.circle.style.visibility = 'visible'
    let progress = (c.progress - (c.freeViewTime + c.transTime)) / c.travelTime
    let freedom = 1 - progress

    c.circlePos.lerp(new Vector3(c.mouse.x * 300 * freedom, -c.mouse.y * 300 * freedom, 0), 0.05)

    c.circle.style.transform = `translate3d(${c.circlePos.x}px, ${c.circlePos.y}px, 0) scale3d(${freedom}, ${freedom}, 1)`

    c.camera.position.lerpVectors(
      new Vector3(0, 3, -15),
      new Vector3(-c.mouse.x * 10 * freedom, c.mouse.y * 10 * freedom + 3, -15),
      Math.sin((progress * Math.PI) / 2)
    )
    c.starship.position.lerpVectors(
      new Vector3(0, -0, -20),
      new Vector3(-c.mouse.x * 5 * freedom, c.mouse.y * 5 * freedom, -13.2),
      Math.sin((progress * Math.PI) / 2)
    )
    c.satellite.container.position.lerpVectors(
      new Vector3(-0, -3.45, -20),
      new Vector3(0, -3.45, -30),
      Math.sin((progress * Math.PI) / 2)
    )

    c.starship.rotation.y = lerp(0, -Math.PI / 4, Math.sin((progress * Math.PI) / 2))

    return
  }
  if (c.progress < c.freeViewTime + c.transTime + c.travelTime + c.transTime) {
    c.controls.enabled = false
    c.controls.autoRotate = false
    let transProgress = (c.progress - (c.freeViewTime + c.transTime + c.travelTime)) / c.transTime
    c.camera.position.lerpVectors(
      new Vector3(0, 3, -15),
      c.lastCamPos,
      -(Math.cos(Math.PI * transProgress) - 1) / 2
    )

    c.circle.style.visibility = 'hidden'
    c.crosshair.style.visibility = 'hidden'
    return
  }
  c.lastCamPos = { ...c.camera.position }
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'
  c.controls.enabled = true

}

c.end = () => {
  c.soundHandlers[c.index].end()
  c.subtitlesHandlers[c.index - 1].end()
  c.hideChapter('chapter_3')
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  })
  c.starship.visible = false
  c.controls.enabled = false
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'
}

const createEarth = options => {
  c.earth = new Earth(options, '3')
  c.earth.container.scale.set(16, 16, 16)
  c.objects.push(c.earth.container)
  c.world.container.add(c.earth.container)
}

const setDebug = () => {
  const debugFolder = c.debug.addFolder('Satelite')
  debugFolder
    .add(c.satellite.container.position, 'x')
    .step(1)
    .min(-50)
    .max(50)
    .name('Position X')
  debugFolder
    .add(c.satellite.container.position, 'y')
    .step(1)
    .min(-50)
    .max(50)
    .name('Position Y')
  debugFolder
    .add(c.satellite.container.position, 'z')
    .step(1)
    .min(-50)
    .max(50)
    .name('Rotation Z')
}

export default c
