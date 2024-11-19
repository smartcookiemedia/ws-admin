import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import { Link } from 'react-router-dom'
import ItemTable from 'common/ItemTable'

function Subscriptions({ location }) {
  const { responseCallback, setAlert } = useStore()
  const [dates, setDates] = useState([])

  const tableHeaders = [
    { name: 'Date', sortable: false },
    { name: 'Count', sortable: false },
    { name: 'Amount', sortable: false },
  ]

  const { search } = location

  useEffect(() => {
    const fetchDates = async () => {
      const termsearch = search ? search.split('?')[1] : null
      const subscriptions = await responseCallback(
        'sendGet',
        `subscriptions?${termsearch}`,
      )
      subscriptions.success && setDates(subscriptions.body.subscriptions)
    }
    fetchDates()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [responseCallback, setAlert, search])

  return (
    <div className="animated fadeIn">
      <ItemTable cardHeader="Subscriptions" tableHeaders={tableHeaders}>
        {Object.entries(dates).map(date => {
          return (
            <tr key={date[0]}>
              <td>
                <Link to={`/subscriptions/started?${date[0]}`}>{date[0]}</Link>
              </td>
              <td>{date[1].count}</td>
              <td>${date[1].amount || 0}</td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default Subscriptions
