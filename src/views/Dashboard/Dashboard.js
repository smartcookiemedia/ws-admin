import React, { Component } from 'react'
import { withStore } from '@spyna/react-store'

class Dashboard extends Component {
  render() {
    return <div className="animated fadeIn">Hello world!</div>
  }
}
export default withStore(Dashboard)
