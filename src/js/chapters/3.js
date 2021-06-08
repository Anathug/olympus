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
    c.satellite = new Satellite(options).container

    c.freeViewTime = 1000
    c.transTime = 500
    c.travelTime = 2000
    c.cameraTarget = new Vector3(0,0,0)
    c.time = 0
    console.log(c.satellite)
    c.objects.push(c.satellite)
    c.objects.forEach(object => {
        object.visible = false
    })
    c.crosshair = document.getElementById('crosshair')
    c.circle = document.getElementById('circle')
    c.circlePos= new Vector3(0,0,0)
}

c.start = () => {
    c.showChapter('chapter_3')
    c.controls.enabled = true
    c.controls.autoRotate = true
    c.camera.position.set(-10, 0, 0)
    c.starship.container.position.set(0, -0.5, 14.5)
    c.satellite.position.set(0, 0, 0)
    c.satellite.visible = true
  c.objects.forEach(object => {
    object.visible = true
  })
  c.starship.container.visible = true
    c.starship.container.children[0].children.forEach(e => {
            e.visible = false
    });
    
    c.starship.container.rotateX(-Math.PI/2)
    c.starship.container.rotateY(Math.PI/2)
    c.starship.container.children[0].children[13].visible = true
}

c.update = () => {
    c.time ++
    if (c.time < c.freeViewTime) return
    if (c.time < c.freeViewTime + c.transTime) {
        c.controls.enabled = false
        c.controls.autoRotate = false
        let transProgress = Math.min(c.time - c.freeViewTime, c.transTime) / c.transTime
        c.camera.position.lerp(new Vector3(0, 0, 12.5), transProgress)
        return
    }
    if (c.time < c.freeViewTime + c.transTime + c.travelTime) {
        c.crosshair.style.visibility = 'visible'
        c.circle.style.visibility = 'visible'
        let freedom = ((c.freeViewTime + c.transTime + c.travelTime) - c.time) / c.travelTime
        let size = 480 * freedom
        c.circlePos.lerp(new Vector3(-size/2 + c.mouse.x*300*freedom, -size/2 - c.mouse.y*300*freedom,0),0.5)
        c.circle.style.width = `${size}px`
        c.circle.style.height = `${size}px`
        c.circle.style.marginLeft = `${c.circlePos.x}px`
        c.circle.style.marginTop = `${c.circlePos.y}px`
        c.camera.position.lerp(new Vector3(-c.mouse.x/10*freedom, -c.mouse.y/10*freedom, 12.5), 0.1)
        c.starship.container.position.lerp(new Vector3(-c.mouse.x/10*freedom, -c.mouse.y/10*freedom - 0.5, 14.5), 0.05)
        return
    }
}

c.end = () => {
  c.hideChapter('chapter_3')
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  });
  c.controls.enabled = false
}

export default c;
