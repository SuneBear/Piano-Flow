import './styles/loading.styl'

const $loading = document.createElement('DIV')
const buildWave = (w, h) => {
  const a = h / 3.3
  const y = h / 2
  const m = 0.512286623256592433

  const pathData = [
    'M', w * 0, y + a / 2,
    'c', a * m, 0, -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a,
    's', -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a,
    's', -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a,
    's', -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a,
    's', -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a,
    's', -(1 - a) * m, -a, a, -a,
    's', -(1 - a) * m, a, a, a
  ].join(' ')

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}px" height="${h}px" viewBox="5 0 ${w} ${h}">
      <path fill="none" stroke="#383838" stroke-width="2" stroke-linecap="round" d="${pathData}">
      </path>
    </svg>
  `
}

$loading.className = 'global-loading'
$loading.innerHTML = `
  <div class="loading-box">
    ${buildWave(60, 40)}
  </div>
`

document.body.appendChild($loading)
