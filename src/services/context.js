import { BehaviorSubject } from 'rxjs/BehaviorSubject'

class Context {
  constructor () {
    // App Status: loading, loaded
    this.status = new BehaviorSubject('loading')
    // App Theme: see styles/themes dir
    this.theme = new BehaviorSubject('monochrome')
    // Game Status: loading, playing (paused, collapsed), stop
    this.gameStatus = new BehaviorSubject('stop')
    // Doc Title
    this.title = new BehaviorSubject('Loading')

    this._automation()
  }

  _automation () {
    this.status.subscribe(this.switchStatus)
    this.theme.subscribe(this.switchTheme)
    this.gameStatus.subscribe(this.switchGameStatus)
    this.title.subscribe(this.setTitle)
  }

  switchStatus (status) {
    document.body.setAttribute('status', status)
  }

  switchTheme (theme) {
    document.body.setAttribute('theme', theme)
  }

  switchGameStatus (status) {
    document.body.setAttribute('game-status', status)
  }

  setTitle (title) {
    document.title = `Piano Flow · ${title}`
  }
}

export const context = new Context()
