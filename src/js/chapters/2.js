import Chapter from '../Chapter'
import { AnimationMixer, LoopOnce, LoopRepeat, AudioListener, Audio } from 'three'
import { Howl, Howler } from 'howler';



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
  c.audio = c.assets.sounds.chap02


  // c.listener = new AudioListener();
  // c.world.container.add(c.listener);
  // c.sound = new Audio(c.listener);
  // c.sound.setBuffer(c.assets.sounds.chap02);


  c.soundN = new Howl({
    src: ['./sounds/chap02.mp3']
  });
  c.soundR = new Howl({
    src: ['./sounds/chap02_r.mp3']
  });
  c.currentSound = c.soundN
}

c.start = () => {
  c.showChapter('chapter_2')
  c.showObjects(c.objects)
  c.handler.allowScroll = true
  c.handler.autoScroll = true
  c.duration = c.soundN.duration()
  c.handler.setAutoScrollSpeed(c.duration)
  c.world.renderer.switchCam(c.cams[1])
  c.reversed = false

  c.soundN.seek(c.progress * c.duration);
  c.soundR.seek(c.duration - c.soundN.seek())
  c.soundN.play();
  c.soundR.stop();
}

c.update = () => {
  c.mixer.setTime(Math.min(c.progress * c.duration, c.animationDuration - 0.01))
  let playbackRate = 1 + (c.progress * c.duration - (c.reversed ? c.duration - c.soundR.seek() : c.soundN.seek())) * 2


  if (playbackRate === 0) {
    playbackRate = 0.0000000000001;
  }

  if (playbackRate > 0) {
    if (c.reversed) { //was rev but no more
      c.currentSound = c.soundN
      c.soundN.play()
      c.soundN.seek(c.duration - c.soundR.seek())
      c.soundR.stop()
      c.reversed = false
    }
    c.soundR.seek(c.duration - c.soundN.seek())
  } else {
    if (!c.reversed) { //was not rev but now is
      c.currentSound = c.soundR
      c.soundR.play()
      c.soundR.seek(c.duration - c.soundN.seek())
      c.soundN.stop()
      c.reversed = true
    }
    c.soundN.seek(c.duration - c.soundR.seek())
  }

  c.currentSound.rate(Math.abs(playbackRate))
}

// c.wheel = () => {
//   c.sound.stop()
//   c.sound.seek(c.progress * c.sound.duration())
//   c.sound.play()
// }

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
    c.mixer.clipAction(clip).setLoop(LoopRepeat)
    c.mixer.clipAction(clip).reset().play();
    if (clip.duration > c.animationDuration)
      c.animationDuration = clip.duration
  });
  clips.forEach(clip => {
    clip.duration = c.animationDuration
  });
}

export default c
