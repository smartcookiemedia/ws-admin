import React from 'react'
import {
  Col,
  Row,
  Button,
  Input,
  Label,
  FormFeedback,
  FormGroup,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'

import PropTypes from 'prop-types'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import { Field, FieldArray, ErrorMessage } from 'formik'

import * as Yup from 'yup'

function ServicesModal({
  showModal,
  closeModal,
  createPop,
  editPop,
  formData,
  isEdit,
  locations,
}) {
  const validationSchema = Yup.object().shape({
    name: !isEdit
      ? Yup.string()
          .min(3, 'Too Short!')
          .max(32, 'Too Long!')
          .required('Required')
          .trim()
      : null,
    domains: Yup.array().of(
      Yup.string()
        .trim()
        .required('Required')
        .matches(
          /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
          {
            message: 'Invalid Domain',
            excludeEmptyString: true,
          },
        )
        .matches(/^(?!(http:\/\/|https:\/\/|www\.)).*$/, {
          message: 'Should not contain www. or http:// or https://',
          excludeEmptyString: true,
        }),
    ),
    unlock_location: Yup.string().required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Service' : 'Create Service'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createPop}
      editItem={editPop}
      isEdit={isEdit}
      size="lg"
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <Row>
          <Col xs="6">
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    disabled={isEdit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder={isEdit ? formData.name : 'Name'}
                  />
                  {errors.name && touched.name ? (
                    <FormFeedback style={{ display: 'inline-block' }}>
                      {errors.name}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormGroup>
                  <Label>Unlock Location</Label>
                  <Input
                    type="select"
                    id="unlock_location"
                    name="unlock_location"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unlock_location}
                  >
                    <option value="">Select One</option>
                    {locations.map(location => (
                      <option key={location.PK} value={location.PK}>
                        {`${location.city}, ${location.country}`}
                      </option>
                    ))}
                  </Input>
                  {errors.unlock_location && touched.unlock_location ? (
                    <FormFeedback style={{ display: 'inline-block' }}>
                      {errors.unlock_location}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
              </Col>
              {isEdit && (
                <Col xs="6">
                  <FormStatus values={values} handleChange={handleChange} />
                </Col>
              )}
            </Row>
          </Col>
          <Col xs="6">
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label>Domains</Label>

                  <FieldArray
                    name="domains"
                    render={arrayHelpers => (
                      <ul className="list-unstyled">
                        {values.domains.map((domain, index) => (
                          <li className="mb-2" key={index}>
                            <InputGroup>
                              <Field
                                name={`domains[${index}]`}
                                className="form-control"
                              />
                              <InputGroupAddon addonType="append">
                                <Button
                                  color="primary"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <strong>x</strong>
                                </Button>
                              </InputGroupAddon>
                            </InputGroup>
                            <span className="error-message">
                              <ErrorMessage name={`domains[${index}]`} />
                            </span>
                          </li>
                        ))}
                        <Button
                          className="mt-2"
                          color="secondary"
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add a Domain
                        </Button>
                      </ul>
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </ItemModal>
  )
}

ServicesModal.propTypes = {
  closeModal: PropTypes.func,
  createPop: PropTypes.func,
  editPop: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  locations: PropTypes.array,
}

export default ServicesModal
