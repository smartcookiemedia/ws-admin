import React from 'react'
import PropTypes from 'prop-types'

import {
  Col,
  Row,
  Input,
  Card,
  CardHeader,
  CardBody,
  Label,
  Button,
  FormGroup,
} from 'reactstrap'

function PromoCodeSearch({ productList, typeList, filterPrices, resetPrices }) {
  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i>Filter
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs="auto">
                  <FormGroup>
                    <Label>By Product</Label>
                    <Input
                      type="select"
                      id="product"
                      name="product"
                      onChange={e =>
                        filterPrices(e.target.name, e.target.value)
                      }
                    >
                      <option value="">Select One</option>
                      {productList
                        .filter(product => product.PK !== 1)
                        .map(product => {
                          return (
                            <option key={product.PK} value={product.PK}>
                              {product.name}
                            </option>
                          )
                        })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="auto">
                  <FormGroup>
                    <Label>By Type</Label>
                    <Input
                      type="select"
                      id="type"
                      name="type"
                      onChange={e =>
                        filterPrices(e.target.name, e.target.value)
                      }
                    >
                      <option value="">Select One</option>
                      {typeList.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="auto" className="button-container">
                  <Button
                    color="primary"
                    className="align-self-end mb-3"
                    onClick={() => resetPrices()}
                  >
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
  setPrices: PropTypes.func,
  productList: PropTypes.array,
  typeList: PropTypes.array,
  filterPrices: PropTypes.func,
  resetPrices: PropTypes.func,
}
