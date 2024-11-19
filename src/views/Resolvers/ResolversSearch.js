import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStore } from 'state'
import { validateSubmitForm } from 'assets/scripts/helper'
import LoadingButton from 'common/LoadingButton'
import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap'

function ResolversSearch({ filterResolvers, typesList }) {
  const { setAlert } = useStore()
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [param, setParam] = useState('')
  const [formData, setFormData] = useState({
    ip: '',
    type: '',
  })

  const submit = async e => {
    e.preventDefault()

    if (!validateSubmitForm(formData, setAlert)) return

    setAlert({ showAlert: false, message: '', isSuccess: false })
    setSubmitting(true)
    filterResolvers(param, searchTerm)
  }

  const handleChange = (type, e) => {
    const { target } = e
    setFormData({
      ...formData,
      [target.name]: target.value,
    })
    if (target.value === '') return
    setParam(type)
    setSearchTerm(target.value)
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Search by one of the
              following
            </CardHeader>
            <CardBody>
              <Form onSubmit={e => submit(e)} id="searchForm">
                <Row>
                  <Col xs="auto">
                    <FormGroup>
                      <Label htmlFor="ip">IP Address</Label>
                      <Input
                        type="text"
                        id="ip"
                        name="ip"
                        onChange={e => handleChange('ip', e)}
                        placeholder="Enter IP"
                      />
                    </FormGroup>
                  </Col>
                  <Col xs="auto">
                    <FormGroup>
                      <Label htmlFor="type">Type</Label>
                      <Input
                        type="select"
                        id="type"
                        name="type"
                        placeholder="Enter Type"
                        onChange={e => handleChange('type', e)}
                      >
                        <option value="">Select a Type</option>
                        {typesList.map(item => {
                          return (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          )
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="12" md="auto" className="button-container">
                    <LoadingButton
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                      positioningFix
                    >
                      {submitting ? 'Submitting...' : 'Search'}
                    </LoadingButton>
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
export default ResolversSearch

ResolversSearch.propTypes = {
  filterResolvers: PropTypes.func,
  typesList: PropTypes.array,
}
