import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import { Link } from 'react-router-dom'
import EmailSearch from 'common/EmailSearch'
import { Badge } from 'reactstrap'
import ItemTable from 'common/ItemTable'
import * as moment from 'moment'

function UsersByDate({ match: { params } }) {
  const { responseCallback } = useStore()
  const [date, setDate] = useState(null)
  const [users, setUsers] = useState([])
  const [sortParam, setSortParam] = useState('sort=asc&')
  const [currentPage, setCurrentPage] = useState(1)
  const tableHeaders = [
    { name: 'ID', sortable: true },
    { name: 'Email', sortable: false },
    { name: 'Resolver', sortable: false },
    { name: 'DOH', sortable: false },
    { name: 'Resolver Status', sortable: false },
    { name: 'Account Status', sortable: false },
    { name: 'Last Active', sortable: false },
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await responseCallback(
        'sendGet',
        `users/date/${params.date}?${sortParam}&page=${currentPage}&limit=50`,
      )

      if (users.success) {
        setDate(params.date)
        setUsers(users.body.users)
      }
    }
    fetchUsers()
  }, [currentPage, params.date, responseCallback, sortParam])

  const lastActiveTime = time => {
    const date = moment.unix(time)
    return moment(date).fromNow()
  }

  return (
    <div className="animated fadeIn">
      <EmailSearch showMonthPicker={false} />
      <ItemTable
        cardHeader={`Users for ${date}`}
        tableHeaders={tableHeaders}
        setSortParam={setSortParam}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagination
      >
        {users.map(user => {
          return (
            <tr key={user.PK}>
              <td>{user.PK}</td>
              <td>
                <Link to={`/users/user/${user.PK}`}>{user.email}</Link>
              </td>
              <td>{user.resolver_ip}</td>
              <td>{user.resolver_doh}</td>
              <td>
                {user.resolver_status === 1 ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge color="secondary">Inactive</Badge>
                )}
              </td>
              <td>
                {user.status === 1 ? (
                  <Badge color="success">Active</Badge>
                ) : (
                  <Badge color="secondary">Inactive</Badge>
                )}
              </td>
              <td>{lastActiveTime(user.last_active)}</td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}
export default UsersByDate
