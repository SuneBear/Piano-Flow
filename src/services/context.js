import { BehaviorSubject } from 'rxjs/BehaviorSubject'

class Context {
  constructor () {
    // App Status
    this.status = new BehaviorSubject('loading')
    // App Theme
    this.theme = new BehaviorSubject('moonized')
    // Doc Title
    this.title = new BehaviorSubject('Loading')

    this._automation()
  }

  _automation () {
    this.status.subscribe(this.switchStatus)
    this.theme.subscribe(this.switchTheme)
    this.title.subscribe(this.setTitle)
  }

  switchStatus (status) {
    document.body.setAttribute('status', status)
  }

  switchTheme (theme) {
    document.body.setAttribute('theme', theme)
  }

  setTitle (title) {
    document.title = `Piano Flow · ${title}`
  }
}

export const context = new Context()
