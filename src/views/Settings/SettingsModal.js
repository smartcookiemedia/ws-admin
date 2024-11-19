import React from 'react'
import { Input, Row, Col, Label, FormGroup, FormFeedback } from 'reactstrap'
import ItemModal from 'common/ItemModal'
import * as Yup from 'yup'

export default function SettingModal({
  showModal,
  closeModal,
  editPop,
  createPop,
  formData,
  isEdit,
}) {
  const validationSchema = Yup.object().shape({
    key: Yup.string()
      .min(1)
      .max(1024)
      .required('Required'),
    value: Yup.string()
      .min(1)
      .max(1024)
      .required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Setting' : 'Create Setting'}
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
                <Label>Setting Key</Label>
                <Input
                  type="text"
                  id="key"
                  name="key"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEdit}
                  value={values.key}
                  placeholder={isEdit ? formData.key : 'Setting Key'}
                />
                {errors.key && touched.key ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.key}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>Setting Value</Label>
                <Input
                  type="text"
                  id="value"
                  name="value"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.value}
                  placeholder="Setting Value"
                />
                {errors.value && touched.value ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.value}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        </>
      )}
    </ItemModal>
  )
}
