import React from 'react'
import { CardBody, CardHeader, FormGroup, Input } from 'reactstrap'

const ListSearch = ({ searchList }) => {
  return (
    <>
      <CardHeader>
        <i className="fa fa-align-justify"></i> Search
      </CardHeader>
      <CardBody>
        <FormGroup>
          <Input
            type="text"
            id="search"
            name="search"
            onChange={searchList}
            placeholder="Search List"
          />
        </FormGroup>
      </CardBody>
    </>
  )
}

export default ListSearch
