import React from 'react'
import { withStore } from '@spyna/react-store'
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  UncontrolledDropdown,
} from 'reactstrap'
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react'
import logo from '../../assets/img/brand/logo.svg'

function DefaultHeader(props) {
  const logout = () => {
    props.store.set('logged_in', false)
    localStorage.session = ''
  }

  const goHome = () => {
    window.location.hash = '/'
  }

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand
        full={{ src: logo, width: 120, height: 40, alt: 'CoreUI Logo' }}
        minimized={{ src: logo, width: 30, height: 30, alt: 'CoreUI Logo' }}
        onClick={() => goHome()}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            <span className="mr-3">{props.store.get('email')}</span>
          </DropdownToggle>
          <DropdownMenu right style={{ height: 'auto', right: 0 }}>
            <DropdownItem onClick={() => logout()}>Logout</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  )
}

export default withStore(DefaultHeader)
