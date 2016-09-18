export function headicons () {
  const $head = document.getElementsByTagName('head')[0]

  // Favicon
  const $favicon = document.createElement('link')
  $favicon.type = 'image/x-icon'
  $favicon.rel = 'shortcut icon'
  $favicon.href = require('../assets/images/icons/favicon.png')
  $head.appendChild($favicon)

  // Apple Touch Icon
  const $appleTouchIcon = document.createElement('link')
  $appleTouchIcon.rel = 'apple-touch-icon'
  $appleTouchIcon.href = require('../assets/images/icons/apple-touch-icon.png')
  $head.appendChild($appleTouchIcon)
}
