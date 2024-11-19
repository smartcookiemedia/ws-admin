import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStore } from 'state'
import { Col, Row, Input, Label, FormGroup, FormFeedback } from 'reactstrap'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import * as Yup from 'yup'

export default function ProductModal({
  showModal,
  closeModal,
  createProduct,
  editProduct,
  formData,
  isEdit,
}) {
  const [typesList, setTypesList] = useState([])
  const { responseCallback } = useStore()
  const validationSchema = Yup.object().shape({
    name: isEdit
      ? null
      : Yup.string()
          .min(3, 'Too Short!')
          .max(32, 'Too Long!')
          .required('Required'),
    type: Yup.string()
      .min(3, 'Too Short!')
      .max(32, 'Too Long!')
      .required('Required'),
    priority: Yup.number().required('Required'),
    proxy_access: Yup.number().required('Required'),
  })

  useEffect(() => {
    const fetchProducts = async () => {
      const typesList = await responseCallback('sendGet', '/products/types')
      typesList.success && setTypesList(typesList.body.products)
    }
    fetchProducts()
  }, [responseCallback])

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Product' : 'Create New Product'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createProduct}
      editItem={editProduct}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <FormGroup>
          <Row>
            <Col xs="6">
              <Label>Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {errors.name && touched.name ? (
                <FormFeedback style={{ display: 'inline-block' }}>
                  {errors.name}
                </FormFeedback>
              ) : null}
            </Col>
            <Col xs="6">
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
                {typesList.map((item, index) => {
                  return (
                    <option key={index} value={item}>
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
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <Label>Priority</Label>
              <Input
                type="number"
                id="priority"
                name="priority"
                placeholder="Priority"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.priority}
              ></Input>
              {errors.priority && touched.priority ? (
                <FormFeedback style={{ display: 'inline-block' }}>
                  {errors.priority}
                </FormFeedback>
              ) : null}
            </Col>
            <Col xs="6">
              <Label>Proxy Access</Label>
              <Input
                type="select"
                id="proxy_access"
                name="proxy_access"
                placeholder="Proxy Access"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.proxy_access}
              >
                <option value="">Select One</option>
                <option value="1">True</option>
                <option value="0">False</option>
              </Input>
              {errors.proxy_access && touched.proxy_access ? (
                <FormFeedback style={{ display: 'inline-block' }}>
                  {errors.proxy_access}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>
          {isEdit && (
            <Row>
              <Col xs="6">
                <FormStatus values={values} handleChange={handleChange} />
              </Col>
            </Row>
          )}
        </FormGroup>
      )}
    </ItemModal>
  )
}

ProductModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createProduct: PropTypes.func,
  editProduct: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
}
