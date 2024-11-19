import React from 'react'
import { Row, Col, Label, ButtonGroup, Button, FormGroup } from 'reactstrap'

export default function FormStatus({ handleChange, values }) {
  return (
    <Row>
      <Col xs="12">
        <Label>Status</Label>
      </Col>
      <Col xs="12">
        <FormGroup>
          <ButtonGroup>
            <Button
              color="primary"
              onClick={() =>
                handleChange({ target: { name: 'status', value: 1 } })
              }
              disabled={!!values.status}
              className={!!values.status ? 'darker-active' : null}
              active={!!values.status}
            >
              Active
            </Button>
            <Button
              color="primary"
              onClick={() =>
                handleChange({ target: { name: 'status', value: 0 } })
              }
              disabled={!Boolean(values.status)}
              className={!Boolean(values.status) ? 'darker-active' : null}
              active={!Boolean(values.status)}
            >
              Inactive
            </Button>
          </ButtonGroup>
        </FormGroup>
      </Col>
    </Row>
  )
}
