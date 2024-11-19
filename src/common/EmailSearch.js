import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStore } from 'state'
import LoadingButton from 'common/LoadingButton'
import SearchByMonth from 'common/SearchByMonth'
import {
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap'

function EmailSearch({ setSearchByDate, showMonthPicker }) {
  const { responseCallback, setAlert } = useStore()
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')

  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const users = await responseCallback('sendGet', `users/email/${email}`)

    if (users.success) {
      const id = users.body.users[0].PK
      window.location.hash = `users/user/${id}`
    } else {
      setAlert({
        showAlert: true,
        message: users.error.message,
        isSuccess: false,
      })
    }
  }

  const handleChange = event => {
    const {
      target: { value },
    } = event
    setEmail(value)
  }

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
                        <Input
                          type="text"
                          id="email"
                          name="email"
                          value={email}
                          required
                          onChange={handleChange}
                          placeholder={'Email'}
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
                    <SearchByMonth
                      setSearchByDate={setSearchByDate}
                      showMonthPicker={showMonthPicker}
                    />
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
export default EmailSearch

EmailSearch.propTypes = {
  setSearchByDate: PropTypes.func,
  showMonthPicker: PropTypes.bool,
}
