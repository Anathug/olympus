//Default chapter class used to create new chapters

export default class Chapter {
  constructor(index) {
    this.index = index
    this.objects = []
    this.title = 'title'
    this.subtitle = 'subtitle'
    this.timelineColor = 'rgb(255,0,0)'
  }

  //initialization is called when the app is loaded
  init() {
  }

  //start is called every time the chapter starts
  start() {

  }

  //update is called every frame while chapter is active
  update() {

  }

  //end is called every time the chapter ends
  end() {

  }
}