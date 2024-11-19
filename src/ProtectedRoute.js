import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withStore } from '@spyna/react-store'
import AdminAPI from 'AdminAPI'

import { Spinner } from 'reactstrap'

function withProtectedRoute(ProtectedComponent) {
  class ProtectedRoute extends Component {
    state = {
      checkingLogin: true,
    }

    async componentDidMount() {
      if (this.props.store.get('logged_in')) {
        this.setState({ checkingLogin: false })
      }
      const session = window.localStorage.getItem('session')

      //validate session by calling the API
      const api = new AdminAPI()
      AdminAPI.auth = session

      const admin = await api.sendGet('admins')

      if (admin.success) {
        this.props.store.set('logged_in', true)
        this.props.store.set('email', admin.body.admins.email)
      } else {
        window.localStorage.removeItem('session')
        this.props.store.set('logged_in', false)
      }

      this.setState({ checkingLogin: false })
    }

    render() {
      if (this.state.checkingLogin) {
        return <Spinner />
      } else if (this.props.store.get('logged_in') === false) {
        return <Redirect to="/login" />
      }

      return <ProtectedComponent {...this.props} />
    }
  }

  return withStore(ProtectedRoute)
}

export default withProtectedRoute
