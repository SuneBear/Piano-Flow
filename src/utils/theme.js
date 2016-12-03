import { context } from '../services'

const $theme = document.createElement('DIV')

~(function () {
  $theme.setAttribute('themify-all', '')
  $theme.style.display = 'none'
  document.body.appendChild($theme)
})()

export function getCurrentTheme () {
  // Get Theme Name
  let themeName
  context.theme.subscribe(name => { themeName = name })

  // Get Colors
  const styles = window.getComputedStyle($theme)
  const brand = styles.fill
  const bg = styles.backgroundColor
  // Firefox Bug: can't get the property border-color
  // REF: https://bugzilla.mozilla.org/show_bug.cgi?id=137688
  const accent = styles.borderLeftColor

  return {
    $name: themeName,
    brand: brand,
    bg: bg,
    accent: accent
  }
}
