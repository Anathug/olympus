import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce } from 'three'

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
  c.cams = []
  createGltf()
  createCams()
  createAnimation()
  c.hideObjects(c.objects)
}

c.start = () => {
  c.showChapter('chapter_2')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[1])
}

c.update = () => {
  if (c.progress < 0.47)
    c.handler.updateTimelineDisplay('Step A02', 'Takeoff of the Olympus rocket')
  else if (c.progress < 0.65)
    c.handler.updateTimelineDisplay('Step A03', 'Release of the boosters')
  else if (c.progress < 0.85)
    c.handler.updateTimelineDisplay('Step A04', 'Release of the first stage')
  else
    c.handler.updateTimelineDisplay('Step A05', 'Injection on a transit orbit to Mars')

  c.mixer.setTime(c.progress * c.animationDuration)
}

c.end = () => {
  c.hideChapter('chapter_2')
  c.hideObjects(c.objects)
  c.allowScroll = false
  c.world.renderer.switchCam('default')
}

const createCams = () => {
  c.gltf.scene.traverse((object) => {
    if (object.isCamera) c.cams.push(object);
  });
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
