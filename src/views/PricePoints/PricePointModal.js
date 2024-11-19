import React from 'react'
import PropTypes from 'prop-types'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import * as Yup from 'yup'
import { Col, Row, Input, Label, FormGroup, FormFeedback } from 'reactstrap'

export default function PricePointModal({
  showModal,
  closeModal,
  createPrice,
  editPrice,
  formData,
  isEdit,
  productList,
  typeList,
}) {
  const validationSchema = Yup.object().shape({
    comment: isEdit
      ? null
      : Yup.string()
          .max(1024)
          .required('Required'),
    product_id: Yup.number().required('Required'),
    price: Yup.number().required('Required'),
    duration: Yup.number().required('Required'),
    type: Yup.string().required('Required'),
    already_billed: Yup.number().required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Price Point' : 'Create New Price Point'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createPrice}
      editItem={editPrice}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Comment</Label>
                <Input
                  type="text"
                  id="comment"
                  name="comment"
                  disabled={isEdit}
                  value={values.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={isEdit ? formData.comment : 'Comment'}
                />
                {errors.comment && touched.comment ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.comment}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Product</Label>
                <Input
                  type="select"
                  id="product"
                  name="product_id"
                  value={values.product_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="0">Select One</option>
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
                {errors.product_id && touched.product_id ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.product_id}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Price"
                />
                {errors.price && touched.price ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.price}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Duration</Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Number of Months"
                />
                {errors.duration && touched.duration ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.duration}
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
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="0">Select One</option>
                  {typeList.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
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
                <Label>Billed</Label>
                <Input
                  type="select"
                  id="billed"
                  name="already_billed"
                  value={values.already_billed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select One</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </Input>
                {errors.already_billed && touched.already_billed ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.already_billed}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          {isEdit && (
            <Row>
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

PricePointModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createPrice: PropTypes.func,
  editPrice: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  productList: PropTypes.array,
  typeList: PropTypes.array,
}
