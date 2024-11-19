import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import { Link } from 'react-router-dom'
import EmailSearch from 'common/EmailSearch'
import ItemTable from 'common/ItemTable'

function Users() {
  const { responseCallback } = useStore()
  const [dates, setDates] = useState([])
  const [searchByDate, setSearchByDate] = useState('')

  const tableHeaders = [
    { name: 'Date', sortable: false },
    { name: 'Count', sortable: false },
  ]

  useEffect(() => {
    const fetchDates = async () => {
      const dates = await responseCallback('sendGet', `users${searchByDate}`)
      dates.success && setDates(dates.body.users)
    }
    fetchDates()
  }, [responseCallback, searchByDate])

  return (
    <div className="animated fadeIn">
      <EmailSearch setSearchByDate={setSearchByDate} />
      <ItemTable cardHeader={'Users'} tableHeaders={tableHeaders}>
        {Object.entries(dates).map(([date, count]) => {
          return (
            <tr key={date}>
              <td>
                <Link to={`/users/date/${date}`}>{date}</Link>
              </td>
              <td>{count}</td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default Users
