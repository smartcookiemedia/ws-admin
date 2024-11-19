import React, { useState, useEffect } from 'react'
import { Badge } from 'reactstrap'
import { useStore } from 'state'
import UserTabController from './UsersTabController'
import ItemTable from 'common/ItemTable'

const tableHeaders = ['Name', 'Domains', 'In Use']

function UserServices(props) {
  const { responseCallback, setAlert } = useStore()
  const [servicesList, setServicesList] = useState([])
  const {
    match: { params },
  } = props

  useEffect(() => {
    const fetchServices = async () => {
      const services = await responseCallback(
        'sendGet',
        `services/user/${params.userId}`,
      )
      if (services.success) {
        setServicesList(services.body.services)
      }
    }
    fetchServices()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [params.userId, responseCallback, setAlert])

  const DomainInfoBox = ({ domains }) => {
    const [showToolTip, setShowToolTip] = useState(false)
    return (
      <div
        className="domain__tooltip"
        onClick={() => setShowToolTip(!showToolTip)}
      >
        <i className="icon-info icons font-2xl d-block"></i>
        {showToolTip && (
          <div className="mt-2 mb-2 animated fadeIn">
            {domains.map((item, index) => {
              return <div key={index}>{item}</div>
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="animated fadeIn">
      <UserTabController {...props} />
      <ItemTable cardHeader="User Services" tableHeaders={tableHeaders}>
        {servicesList.map(item => {
          return (
            <tr key={item.PK}>
              <td>{item.name}</td>
              <td width="40%">
                <DomainInfoBox domains={item.domains} />
              </td>
              <td>
                {item.in_use ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge color="secondary">Inactive</Badge>
                )}
              </td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default UserServices
