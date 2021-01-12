function login() {
  event.preventDefault()

  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/login', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify({
    email: email,
    password: password
  }))
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status === 200) {
      const data = JSON.parse(this.responseText)
    } else {
      alert('Error Invalid')
    }

    // end of state change: it can be after some time (async)
  }
}
