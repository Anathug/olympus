import { Howl } from 'howler'

export default class SoundHandler {
    constructor(soundNormalPath, soundReversePath) {
        //initialize sound handler with a normal version of the track and a reversed one
        this.soundN = new Howl({
            src: [soundNormalPath],
        })
        this.soundR = new Howl({
            src: [soundReversePath],
        })
        this.currentSound = this.soundN
        this.duration = 120
    }
    start(progress) {
        //resets all tracks to their default values
        this.duration = this.soundN.duration()

        this.soundN.seek(progress * this.duration)
        this.soundN.play()
        this.soundN.rate(1)
        this.soundN.volume(1)

        this.soundR.seek(this.duration - this.soundN.seek())
        this.soundR.stop()
        this.soundR.rate(1)
        this.soundR.volume(1)

        this.reversed = false
    }
    update(progress) {
        //if chapter progress is higher that the track progress, the normal track is played. Otherwise the reverse track is played.
        //the playback rate is proportional to the difference between the chapter progress and the track progress
        let playbackRate =
            1 +
            (progress * this.duration - (this.reversed ? this.duration - this.soundR.seek() : this.soundN.seek())) * 2

        if (playbackRate === 0) {
            playbackRate = 0.0000000000001
        }

        if (playbackRate > 0) {
            if (this.reversed) {
                //was rev but no more
                this.currentSound = this.soundN
                this.soundN.play()
                this.soundN.seek(this.duration - this.soundR.seek())
                this.soundR.stop()
                this.reversed = false
            }
            this.soundR.seek(this.duration - this.soundN.seek())
        } else {
            if (!this.reversed) {
                //was not rev but now is
                this.currentSound = this.soundR
                this.soundR.play()
                this.soundR.seek(this.duration - this.soundN.seek())
                this.soundN.stop()
                this.reversed = true
            }
            this.soundN.seek(this.duration - this.soundR.seek())
        }
        this.currentSound.rate(Math.abs(playbackRate))
        this.currentSound.volume(Math.min(1 / Math.abs(playbackRate), 1.0))
    }

    end() {
        //stops all tracks
        this.soundN.stop()
        this.soundR.stop()
        this.currentSound.stop()
    }
}

