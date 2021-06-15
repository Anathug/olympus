import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, AudioListener, Audio } from 'three'

let c = new Chapter(2)

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

  c.listener = new AudioListener();
  // c.objects.push(c.listener);
  c.world.container.add(c.listener)

  // create a global audio source
  c.sounds = [new Audio(c.listener), new Audio(c.listener)];

  // load a sound and set it as the Audio object's buffer
  c.sounds[0].setBuffer(c.assets.sounds.chap02);
  c.sounds[1].setBuffer(c.assets.sounds.chap02_r);
}

c.start = () => {
  c.showChapter('chapter_2')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.world.renderer.switchCam(c.cams[1])
  c.sounds[0].play()
}

c.update = () => {
  c.mixer.setTime(c.progress * c.animationDuration)
  console.log(c.sounds[0].context.currentTime, c.sounds[0].buffer.duration)
  c.sounds[0].playbackRate = 0.2

}

c.end = () => {
  c.hideChapter('chapter_2')
  c.hideObjects(c.objects)
  c.allowScroll = false
  c.world.renderer.switchCam('default')


  c.sounds[0].stop()
  c.sounds[1].stop()
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
