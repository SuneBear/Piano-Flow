export function request (url, method = 'GET', body) {
  return window.fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    method: method,
    body: typeof body === 'object' ? JSON.stringify(body) : body
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return (response.headers.get('Content-Type') === 'application/json' ? response.json() : response.blob())
          .catch(() => { return '' })
      } else {
        return Promise.reject(response)
      }
    })
}
