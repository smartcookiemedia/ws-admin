import React, { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Col, Row, Table, Badge } from 'reactstrap'

import { useStore } from 'state'
import UserTabController from './UsersTabController'

function UserProfiles(props) {
  const { responseCallback, setAlert } = useStore()
  const {
    match: { params },
  } = props

  const [customLists, setCustomLists] = useState([])
  const [listsEnabled, setListsEnabled] = useState([])

  useEffect(() => {
    const fetchProfiles = async () => {
      const profiles = await responseCallback(
        'sendGet',
        `rules/user/${params.userId}`,
      )

      if (profiles.success) {
        setCustomLists(profiles.body.rules.custom.rules)
        setListsEnabled(profiles.body.rules.lists.lists_enabled)
      }
    }
    fetchProfiles()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [params.userId, responseCallback, setAlert])

  return (
    <div className="animated fadeIn">
      <UserTabController {...props} />
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <strong>User Profiles List (R.O.B.E.R.T)</strong>
            </CardHeader>

            <CardBody>
              <h5>
                <strong>Enabled Rules</strong>
              </h5>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>
                      <strong>Rule</strong>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listsEnabled.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </CardBody>

            <CardBody>
              <h5>
                <strong>Custom Rules</strong>
              </h5>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Folder</th>
                    <th>Via</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customLists.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.domain}</td>
                        <td>{item.folder}</td>
                        <td>{item.via}</td>
                        <td>
                          {item.status === 1 ? (
                            <Badge color="success">Active</Badge>
                          ) : (
                            <Badge color="secondary">Inactive</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserProfiles
