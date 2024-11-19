import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import ItemTable from 'common/ItemTable'
import { Link } from 'react-router-dom'

function Payments({ location }) {
  const { responseCallback } = useStore()
  const [dates, setDates] = useState([])
  const tableHeaders = [
    { name: 'Date', sortable: false },
    { name: 'Count', sortable: false },
    { name: 'Amount', sortable: false },
  ]

  const { search } = location

  useEffect(() => {
    const fetchDates = async () => {
      const termSearch = search ? search.split('?')[1] : null
      const res = await responseCallback('sendGet', `payments?${termSearch}`)
      res.success && setDates(res.body.payments)
    }
    fetchDates()
  }, [responseCallback, search])

  return (
    <div className="animated fadeIn">
      <ItemTable cardHeader={'Payments'} tableHeaders={tableHeaders}>
        {Object.entries(dates).map(date => {
          return (
            <tr key={date[0]}>
              <td>
                <Link to={`/payments/date?${date[0]}`}>{date[0]}</Link>
              </td>
              <td>{date[1].count}</td>
              <td>{date[1].amount ? `$${date[1].amount}` : 0}</td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}

export default Payments
