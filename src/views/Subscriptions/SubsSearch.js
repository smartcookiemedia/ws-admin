import React, { useState, useEffect } from 'react'
import * as moment from 'moment'
import LoadingButton from 'common/LoadingButton'
import SearchByMonth from 'common/SearchByMonth'
import {
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Card,
  CardHeader,
  CardBody,
  InputGroupButtonDropdown,
  InputGroupAddon,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
} from 'reactstrap'
import { useStore } from 'state'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function SubsSearch() {
  const { responseCallback, setAlert } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchByDate, setSearchByDate] = useState('')
  const [inputParam, setInputParam] = useState('Start Date')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState([
    { name: 'Start Date', active: true, param: 'started' },
    { name: 'End Date', active: false, param: 'ended' },
    { name: 'Subscription ID', active: false, param: 'sub_id' },
    { name: 'Email', active: false, param: 'email' },
  ])

  const submit = async e => {
    setSubmitting(true)
    e.preventDefault()
    const { param } = dropdownOptions.find(option => option.active === true)

    if (param === 'email') {
      const res = await responseCallback('sendGet', `users/email/${searchTerm}`)
      if (res.success) {
        const userId = res.body.users[0].PK
        window.location.hash = `subscriptions/user?${userId}`
      } else {
        setAlert({
          showAlert: true,
          message: 'Email address does not exist',
          isSuccess: false,
        })
      }
      return
    }

    window.location.hash = `subscriptions/${param}?${searchTerm}`
  }

  const handleChange = event => {
    const {
      target: { value },
    } = event

    setSearchTerm(value)
  }

  const handleDateChange = (param, date) => {
    const dateformatted =
      date instanceof Date ? moment(date).format('YYYY-MM-DD') : ''

    if (dateformatted === '') return

    setSearchTerm(dateformatted)
  }

  const setActive = option => {
    const newOptions = dropdownOptions.map(opt => {
      if (option.active) {
        return opt
      } else if (opt.active) {
        return { ...opt, active: false }
      } else if (opt.name === option.name) {
        return { ...opt, active: true }
      }
      return opt
    })
    setDropdownOptions(newOptions)
  }

  useEffect(() => {
    const { name } = dropdownOptions.find(option => option.active === true)
    setInputParam(name)
  }, [dropdownOptions])

  useEffect(() => {
    window.location.hash = `subscriptions${searchByDate}`
  }, [searchByDate])

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Search
            </CardHeader>
            <CardBody>
              <Form onSubmit={e => submit(e)}>
                <Row>
                  <Col xs="12" sm="7" md="6" className="subsSearch">
                    <FormGroup>
                      <InputGroup>
                        <InputGroupButtonDropdown
                          addonType="prepend"
                          isOpen={showDropdown}
                          toggle={() => setShowDropdown(!showDropdown)}
                        >
                          <DropdownToggle caret>
                            <i className="fa fa-search mr-1"></i>
                          </DropdownToggle>
                          <DropdownMenu className={showDropdown ? 'show' : ''}>
                            {dropdownOptions.map(option => (
                              <DropdownItem
                                active={option.active}
                                key={option.name}
                                onClick={() => setActive(option)}
                              >
                                {option.name}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </InputGroupButtonDropdown>
                        {inputParam === 'Start Date' && (
                          <DatePicker
                            placeholderText="Click to select a start date"
                            selected={startDate}
                            name="startdate"
                            onChange={date => {
                              setStartDate(date)
                              handleDateChange('started', date)
                            }}
                            dateFormat="yyyy-MM-dd"
                          />
                        )}
                        {inputParam === 'End Date' && (
                          <DatePicker
                            placeholderText="Click to select an end date"
                            name="enddate"
                            selected={endDate}
                            onChange={date => {
                              setEndDate(date)
                              handleDateChange('ended', date)
                            }}
                            dateFormat="yyyy-MM-dd"
                          />
                        )}
                        {(inputParam === 'Subscription ID' ||
                          inputParam === 'Email') && (
                          <Input
                            type="text"
                            id="text"
                            value={searchTerm}
                            required
                            onChange={handleChange}
                            placeholder={inputParam}
                          />
                        )}
                        <InputGroupAddon addonType="append">
                          <LoadingButton
                            submitting={submitting}
                            setSubmitting={setSubmitting}
                          >
                            {submitting ? 'Submitting...' : 'Search'}
                          </LoadingButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="5" md="6">
                    {window.location.hash.match(
                      /(#\/subscriptions)(\/?\?{0}|\/?\?month{1}.*)$/,
                    ) && <SearchByMonth setSearchByDate={setSearchByDate} />}
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default SubsSearch
