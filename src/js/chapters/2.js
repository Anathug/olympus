import Chapter from '../Chapter'
import Launcher from '../World/Launcher'
import { Clock, AnimationMixer, LoopOnce, Box3 } from 'three'
import gsap from 'gsap'

let c = new Chapter(2)
let updateThrusters = false
let clock = new Clock()
const startButton = document.querySelector('.chapter_2 button')
//startButton.addEventListener('click', launchStarship)

c.init = options => {
  c.mouse = c.world.mouse.mouse
  c.assets = options.assets
  c.debug = options.debug
  c.world = options.world
  c.allowScroll = true
  c.autoScroll = true
  c.allowMouseMove = false
  c.gltf = c.assets.models.animations.chap02
  c.cams = []

  c.gltf.scene.traverse((object) => {
    if (object.isCamera) c.cams.push(object);
  });

  c.world.renderer.switchCam(c.cams[1])

  c.mixer = new AnimationMixer(c.gltf.scene)
  c.world.container.add(c.gltf.scene)
  c.objects.push(c.gltf.scene)
  console.log(c.gltf)
  c.objects.forEach(object => {
    object.visible = false
  })
}

c.start = () => {
  c.showChapter('chapter_2')
  c.objects.forEach(object => {
    object.visible = true
  })
  chapterBegin()
  
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  
  c.world.renderer.switchCam(c.cams[1])
}

c.update = () => {
  c.mixer.setTime(c.progress * c.animationDuration)
}

c.end = () => {
  c.hideChapter('chapter_2')
  c.allowScroll = false
  c.objects.forEach(object => {
    object.visible = false
  })
  c.world.renderer.switchCam('default')
}

const chapterBegin = () => {
  const clips = c.assets.models.animations.chap02.animations
  console.log(clips)
  c.animationDuration = 0


  clips.forEach(clip => {
    // c.mixer.clipAction(clip).play();
    c.mixer.clipAction(clip).setLoop(LoopOnce)
    c.mixer.clipAction(clip).reset().play();

    if (clip.duration > c.animationDuration)
      c.animationDuration = clip.duration
  });

  clips.forEach(clip => {
    clip.duration = c.animationDuration
  });
}



export default c
