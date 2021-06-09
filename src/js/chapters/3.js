import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock, Vector3 } from 'three'
import gsap from 'gsap'
import lerp from '../Tools/Lerp'
import Satellite from '../World/Satellite'

let c = new Chapter(3)

c.init = (options) => {
  c.camera = options.world.camera.camera
  c.controls = options.world.camera.orbitControls
  c.mouse = c.world.mouse.mouse
  c.debug = options.debug
  c.world = options.world
  c.starship = options.starship
  c.satellite = new Satellite(options)
  c.world.container.add(c.satellite.container)
  c.freeViewTime = 0.3
  c.transTime = 0.05
  c.travelTime = 0.4
  c.cameraTarget = new Vector3(0, 0, 0)
  c.time = 0
  c.objects.push(c.satellite.container)
  c.objects.forEach(object => {
    object.visible = false
  })
  c.crosshair = document.getElementById('crosshair')
  c.circle = document.getElementById('circle')
  c.lastCamPos = new Vector3(0, 0, 0)
  c.circlePos = new Vector3(0, 0, 0)
}

c.start = () => {
  c.showChapter('chapter_3')
  c.controls.enabled = true
  c.controls.autoRotate = true
  c.camera.position.set(-30, 0, 0)
  c.starship.container.position.set(0, -0, -30)
  console.log(c.satellite)
  c.satellite.container.scale.set(1, 1, 1)
  c.starship.container.scale.set(0.1, 0.1, 0.1)
  c.anchor = new Vector3(0, 0, 0)
  c.satellite.container.position.set(-0, -0, -0 + 4)
  c.satellite.container.visible = true
  c.objects.forEach(object => {
    object.visible = true
  })
  c.starship.container.visible = true
  c.starship.container.children[0].children.forEach(e => {
    e.visible = false
  });
  c.starship.container.rotation.x = Math.PI / 2
  c.starship.container.rotation.y = -Math.PI / 2;

  //c.starship.container.rotateX(Math.PI / 2)
  //c.starship.container.rotateY(-Math.PI / 2)
  c.starship.container.children[0].children[13].visible = true
  c.world.scene.fog.far = 2000

  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'
}

c.update = () => {
  console.log(c.progress)
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
    c.starship.container.position.lerpVectors(
      new Vector3(0, -0, -30),
      new Vector3(-c.mouse.x * 5 * freedom, c.mouse.y * 5 * freedom, -25),
      Math.sin((progress * Math.PI) / 2)
    )
    c.satellite.container.position.lerpVectors(
      new Vector3(-0, -0, -0 + 4),
      new Vector3(-0, -0, -0),
      Math.sin((progress * Math.PI) / 2))
    return
  }
  c.lastCamPos = { ...c.camera.position }
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'
  c.controls.enabled = true
}

c.end = () => {
  c.hideChapter('chapter_3')
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  });
  c.controls.enabled = false
  c.circle.style.visibility = 'hidden'
  c.crosshair.style.visibility = 'hidden'
}

export default c;
