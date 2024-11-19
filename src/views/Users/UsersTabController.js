import React from 'react'
import { Col, Row, Button } from 'reactstrap'
import { NavLink } from 'react-router-dom'

function UserTabController(props) {
  const {
    match: {
      params: { userId },
    },
  } = props

  return (
    <div className="tab-switchboard mb-5">
      <Row>
        <Col xl className="col-sm mb-3 mb-xl-0">
          <NavLink to={`/users/user/${userId}`} activeclassname="active" exact>
            <Button block className="btn btn-light">
              User Details
            </Button>
          </NavLink>
        </Col>
        <Col xl className="col-sm mb-3 mb-xl-0">
          <NavLink
            to={`/users/user/${userId}/resmaps`}
            strict
            activeclassname="active"
          >
            <Button block className="btn btn-light">
              User IPs
            </Button>
          </NavLink>
        </Col>
        <Col xl className="col-sm mb-3 mb-xl-0">
          <NavLink
            to={`/users/user/${userId}/payments`}
            strict
            activeclassname="active"
          >
            <Button block className="btn btn-light">
              Payments
            </Button>
          </NavLink>
        </Col>
        <Col xl className="col-sm mb-3 mb-xl-0">
          <NavLink
            to={`/users/user/${userId}/profiles`}
            strict
            activeclassname="active"
          >
            <Button block className="btn btn-light">
              Profiles
            </Button>
          </NavLink>
        </Col>
        <Col xl className="col-sm mb-3 mb-xl-0">
          <NavLink
            to={`/users/user/${userId}/services`}
            strict
            activeclassname="active"
          >
            <Button block className="btn btn-light">
              Disabled Services
            </Button>
          </NavLink>
        </Col>
      </Row>
    </div>
  )
}

export default UserTabController
