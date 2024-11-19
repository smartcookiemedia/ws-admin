import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Input, Label, FormGroup, FormFeedback } from 'reactstrap'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import * as Yup from 'yup'

function ResolverModal({
  showModal,
  closeModal,
  createResolver,
  editResolver,
  formData,
  isEdit,
  typesList,
}) {
  const validationSchema = Yup.object().shape({
    ip: isEdit
      ? null
      : Yup.string()
          .required('Required')
          .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
            message: 'Invalid IP address',
            excludeEmptyString: true,
          })
          .test(
            'ip',
            'IP address value should be less or equal to 255',
            value => {
              if (value === undefined || value.trim() === '') return true
              return value.split('.').find(i => parseInt(i) > 255) === undefined
            },
          ),
    type: Yup.string()
      .min(3)
      .max(32)
      .required('Required'),
    label: Yup.string()
      .min(3)
      .max(32)
      .required('Required'),
    name: Yup.string()
      .min(3)
      .max(32)
      .required('Required'),
    doh: Yup.string()
      .min(3)
      .max(255)
      .url()
      .required('Required'),
    order: Yup.number().min(1),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Resolver' : 'Create New Resolver'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createResolver}
      editItem={editResolver}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>IP</Label>
                <Input
                  type="text"
                  id="ip"
                  name="ip"
                  disabled={isEdit}
                  value={values.ip}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={isEdit ? formData.PK : 'IP'}
                />
                {errors.ip && touched.ip ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.ip}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Name"
                />
                {errors.name && touched.name ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.name}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Type</Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  placeholder="Type"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.type}
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
                {errors.type && touched.type ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.type}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Label</Label>
                <Input
                  type="text"
                  id="label"
                  name="label"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.label}
                  placeholder="Label"
                />
                {errors.label && touched.label ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.label}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label>DoH</Label>
                <Input
                  type="text"
                  id="doh"
                  name="doh"
                  value={values.doh}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter DoH"
                />
                {errors.doh && touched.doh ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.doh}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          {isEdit && (
            <Row>
              <Col xs="6">
                <FormGroup>
                  <Label>Order</Label>
                  <Input
                    type="number"
                    name="order"
                    id="order"
                    value={values.order}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.order && touched.order ? (
                    <FormFeedback style={{ display: 'inline-block' }}>
                      {errors.order}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
              </Col>
              <Col xs="6">
                <FormStatus values={values} handleChange={handleChange} />
              </Col>
            </Row>
          )}
        </>
      )}
    </ItemModal>
  )
}

export default ResolverModal

ResolverModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createResolver: PropTypes.func,
  editResolver: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  typesList: PropTypes.array,
}
