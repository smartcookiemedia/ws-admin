import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { FormGroup } from 'reactstrap'

function SearchByMonth({ setSearchByDate, showMonthPicker = true }) {
  const [startDate, setStartDate] = useState(null)

  const handleDateChange = (param, date) => {
    const dateformatted =
      date instanceof Date ? moment(date).format('YYYY-MM') : ''
    if (dateformatted === '') return
    setSearchByDate(`?month=${dateformatted}`)
  }

  return (
    <>
      {showMonthPicker && (
        <FormGroup className="search-by-month__container">
          <DatePicker
            placeholderText="Search by Month"
            selected={startDate}
            onChange={date => {
              handleDateChange('started', date)
              setStartDate(date)
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </FormGroup>
      )}
    </>
  )
}
export default SearchByMonth

SearchByMonth.propTypes = {
  setSearchByDate: PropTypes.func,
  showMonthPicker: PropTypes.bool,
}
