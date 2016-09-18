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
        return response.json()
          .catch(() => { return '' })
      } else {
        return Promise.reject(response)
      }
    })
}
