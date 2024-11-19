import React, { useState, useEffect } from 'react'
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

function PaymentSearch() {
  const { responseCallback, setAlert } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchByDate, setSearchByDate] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [inputPlaceholder, setInputPlaceholder] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState([
    { name: 'Transaction ID', active: true, param: 'tx_id' },
    { name: 'Subscription ID', active: false, param: 'sub_id' },
    { name: 'Fingerprint', active: false, param: 'fingerprint' },
    { name: 'Email', active: false, param: 'email' },
  ])

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const { param } = dropdownOptions.find(option => option.active === true)
    if (param === 'email') {
      const res = await responseCallback('sendGet', `users/email/${searchTerm}`)
      if (res.success) {
        const userId = res.body.users[0].PK
        window.location.hash = `payments/user?${userId}`
      } else {
        setAlert({
          showAlert: true,
          message: 'Email address does not exist',
          isSuccess: false,
        })
      }
      return
    }

    window.location.hash = `payments/${param}?${searchTerm}`
  }

  const handleChange = event => {
    const {
      target: { value },
    } = event
    setSearchTerm(value)
  }

  useEffect(() => {
    window.location.hash = `payments${searchByDate}`
  }, [searchByDate])

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
    setInputPlaceholder(name)
  }, [dropdownOptions])

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
                  <Col xs="12" sm="7" md="6">
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
                        <Input
                          type="text"
                          id="text"
                          value={searchTerm}
                          required
                          onChange={handleChange}
                          placeholder={inputPlaceholder}
                        />
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
                      /(#\/payments)(\/?\?{0}|\/?\?month{1}.*)$/,
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
export default PaymentSearch
