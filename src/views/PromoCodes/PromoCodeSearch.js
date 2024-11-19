import React, { useState } from 'react'
import PropTypes from 'prop-types'
import LoadingButton from 'common/LoadingButton'
import {
  Col,
  Row,
  Button,
  ButtonGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
} from 'reactstrap'

function PromoCodeSearch({ setSearchParam, setCurrentPage }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [promoType, setPromoType] = useState()
  const [submitting, setSubmitting] = useState(false)

  const filterPromoCodes = type => {
    setSearchTerm('')
    setPromoType(!!type)
    setSearchParam(`/multiuse/${type}`)
    setCurrentPage(1)
  }

  const submitSearch = e => {
    setSubmitting(true)
    e.preventDefault()
    setSearchParam(`/${searchTerm}`)
    setCurrentPage(1)
  }

  const resetCodes = () => {
    setSearchTerm('')
    setPromoType()
    setSearchParam('')
    setCurrentPage(1)
  }

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Search OR Filter
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="auto" style={{ marginBottom: '0.5rem' }}>
                  <Form onSubmit={e => submitSearch(e)}>
                    <FormGroup>
                      <InputGroup>
                        <Input
                          type="text"
                          id="email"
                          name="email"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          placeholder="Promo Code"
                        />
                        <InputGroupAddon addonType="append">
                          <LoadingButton
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                          >
                            {submitting ? 'Submitting...' : 'Search'}
                          </LoadingButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </Col>
                <Col xs="auto">
                  <FormGroup>
                    <ButtonGroup>
                      <Button
                        color="primary"
                        onClick={() => filterPromoCodes(1)}
                        active={promoType}
                      >
                        Multi Use
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => filterPromoCodes(0)}
                        active={promoType === false}
                      >
                        Single Use
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </Col>
                <Col>
                  <Button color="primary" onClick={() => resetCodes()}>
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
export default PromoCodeSearch

PromoCodeSearch.propTypes = {
  setSearchParam: PropTypes.func,
  setCurrentPage: PropTypes.func,
}
