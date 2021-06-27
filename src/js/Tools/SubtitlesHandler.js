export default class SubtitlesHandler {
    constructor(subtitlePath, trackDuration) {
        this.container = document.querySelector('#subtitlesContainer')
        this.currentIndex = 0
        this.subtitles = []
        fetch(subtitlePath)
            .then(r => r.text())
            .then(t => {
                let substrings = t.split('\n')
                let currentStartTime = 0
                substrings.forEach(s => {
                    let group = s.split('\t')
                    this.subtitles.push({
                        startTime: currentStartTime,
                        string: group[1] ? group[1].split('\r')[0] : '',
                        style: group[2] ? group[2].split('\r')[0] : ''
                    })
                    let a = group[0].split(':')
                    currentStartTime += (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
                    this.endTime = currentStartTime
                });
            })
    }

    start(duration) {
        this.duration = duration
        this.container.textContent = ''
        this.container.className = 'subtitlesEmpty'
    }

    update(progress) {
        if (progress * this.duration > this.endTime) {
            this.end()
        }
        else if (this.subtitles[this.currentIndex + 1] && progress * this.duration > this.subtitles[this.currentIndex + 1].startTime) {
            this.currentIndex++
            this.updateSubtitles()
        }
        else if (progress * this.duration < this.subtitles[this.currentIndex].startTime) {
            this.currentIndex--
            this.updateSubtitles()
        }
    }

    updateSubtitles() {
        this.container.textContent = this.subtitles[this.currentIndex].string
        switch (this.subtitles[this.currentIndex].style.toLowerCase()) {
            case 'italic':
                this.container.className = 'subtitlesItalic'
                break;
            case 'empty':
                this.container.className = 'subtitlesEmpty'
                break;
            default:
                this.container.className = ''
                break;
        }
    }

    clear() {
    }

    end() {
        this.container.textContent = ''
        this.container.className = 'subtitlesEmpty'
    }
}