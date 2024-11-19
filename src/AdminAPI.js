class AdminAPI {
  apiURL =
    process.env.REACT_APP_ENV === 'local'
      ? 'http://api-admin.controld.local:8000/'
      : process.env.REACT_APP_ENV === 'staging'
      ? 'https://api-admin.stg.controld.com/'
      : 'http://api-admin.controld.com/'

  static auth

  async postData(endPoint = '', data = {}, sendAuth = true) {
    const url = this.apiURL + endPoint

    let headers = {
      'Content-Type': 'application/json',
    }

    if (sendAuth) {
      headers = {
        ...headers,
        Authorization: AdminAPI.auth,
      }
    }

    const res = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })

    const json = await res.json()

    return json === null ? { error: { message: 'No response from API' } } : json
  }

  async putData(endPoint = '', data = {}) {
    const url = this.apiURL + endPoint

    const headers = {
      'Content-Type': 'application/json',
      Authorization: AdminAPI.auth,
    }

    const res = await fetch(url, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })

    const json = await res.json()

    return json === null ? { error: { message: 'No response from API' } } : json
  }

  async getData(endPoint = '', data = {}, sendAuth = true) {
    let url = this.apiURL + endPoint

    if (Object.keys(data).length > 0) {
      url += '?' + JSON.stringify(data)
    }

    let headers = {
      'Content-Type': 'application/json',
    }

    if (sendAuth) {
      headers = {
        ...headers,
        Authorization: AdminAPI.auth,
      }
    }

    const res = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
    })

    const json = await res.json()

    return json === null ? { error: { message: 'No response from API' } } : json
  }

  async deleteData(endPoint = '', data = {}) {
    const url = this.apiURL + endPoint

    const headers = {
      'Content-Type': 'application/json',
      Authorization: AdminAPI.auth,
    }

    const res = await fetch(url, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'omit', // include, *same-origin, omit
      headers: headers,
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })

    const json = await res.json()

    return json === null ? { error: { message: 'No response from API' } } : json
  }

  async sendGet(endpoint) {
    try {
      const response = await this.getData(endpoint)

      return response
    } catch (e) {
      return { success: false, error: { message: e.toString() } }
    }
  }

  async sendDelete(endpoint) {
    try {
      const response = await this.deleteData(endpoint)

      return response
    } catch (e) {
      console.error(e)

      return { success: false, error: { message: e.toString() } }
    }
  }

  async login({ email, password }) {
    try {
      const response = await this.postData(
        'admins/login',
        { email, password },

        false,
      )

      if (response.success) {
        //save session to local storage
        window.localStorage.setItem('session', response.body.session)

        AdminAPI.auth = response.body.session
      }

      return response
    } catch (e) {
      return { success: false, error: { message: e.toString() } }
    }
  }
}

export default AdminAPI
