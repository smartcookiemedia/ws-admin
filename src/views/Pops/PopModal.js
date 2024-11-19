import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Input, Label, FormFeedback, FormGroup } from 'reactstrap'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import * as Yup from 'yup'
import countries from 'countryList.js'

function PopModal({
  showModal,
  closeModal,
  createPop,
  editPop,
  formData,
  isEdit,
}) {
  const validationSchema = Yup.object().shape({
    id: isEdit
      ? null
      : Yup.string()
          .min(3, 'Too Short!')
          .max(3, 'Too Long!')
          .required('Required'),
    city: Yup.string()
      .min(3, 'Too Short!')
      .max(64, 'Too Long!')
      .required('Required'),
    country: Yup.string()
      .min(2, 'Too Short!')
      .max(2, 'Too Long!')
      .required('Required'),
    lat: Yup.number().required('Required'),
    long: Yup.number().required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit POP' : 'Create New POP'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createPop}
      editItem={editPop}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>IATA airport code</Label>
                <Input
                  type="text"
                  id="airport-code"
                  name="id"
                  disabled={isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.id}
                  placeholder={isEdit ? formData.PK : 'Airport Code'}
                />
                {errors.id && touched.id ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.id}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.city}
                  placeholder="City"
                />
                {errors.city && touched.city ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.city}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Country</Label>
                <Input
                  type="select"
                  id="country"
                  name="country"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.country}
                  placeholder="Country"
                >
                  <option value="">Select One</option>
                  {countries.map(country => (
                    <option key={country.name} value={country['alpha-2']}>
                      {country.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Lat</Label>
                <Input
                  type="number"
                  step="any"
                  id="lat"
                  name="lat"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lat}
                  placeholder="lat"
                />
                {errors.lat && touched.lat ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.lat}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Long</Label>
                <Input
                  type="number"
                  step="any"
                  id="long"
                  name="long"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.long}
                  placeholder="long"
                />
                {errors.long && touched.long ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.long}
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
        </>
      )}
    </ItemModal>
  )
}

export default PopModal

PopModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createPop: PropTypes.func,
  editPop: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
}
