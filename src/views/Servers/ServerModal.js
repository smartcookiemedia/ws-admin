import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Input, Label, FormGroup, FormFeedback } from 'reactstrap'
import ItemModal from 'common/ItemModal'
import FormStatus from 'common/FormStatus'
import * as Yup from 'yup'

export default function ServerModal({
  showModal,
  closeModal,
  createServer,
  editServer,
  formData,
  isEdit,
  popsList,
}) {
  const validationSchema = Yup.object().shape({
    hostname: isEdit
      ? null
      : Yup.string()
          .min(3)
          .max(255)
          .required('Required'),
    pop: Yup.string()
      .min(3)
      .max(3)
      .required('Required'),
  })

  return (
    <ItemModal
      modalHeader={isEdit ? 'Edit Server' : 'Create New Server'}
      showModal={showModal}
      closeModal={closeModal}
      createItem={createServer}
      editItem={editServer}
      isEdit={isEdit}
      validationSchema={validationSchema}
      initialValues={formData}
    >
      {({ handleChange, handleBlur, values, errors, touched }) => (
        <>
          <Row>
            <Col xs="6">
              <FormGroup>
                <Label>Host Name</Label>
                <Input
                  type="text"
                  id="hostname"
                  name="hostname"
                  disabled={isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={isEdit ? formData.PK : 'Host Name'}
                />
                {errors.hostname && touched.hostname ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.hostname}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label>POPs</Label>
                <Input
                  type="select"
                  id="pop"
                  name="pop"
                  value={values.pop}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option>Select a POP</option>
                  {popsList.map(pop => {
                    return (
                      <option key={pop.PK} value={pop.PK}>
                        {pop.PK.toUpperCase()}
                      </option>
                    )
                  })}
                </Input>
                {errors.pop && touched.pop ? (
                  <FormFeedback style={{ display: 'inline-block' }}>
                    {errors.pop}
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

ServerModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createServer: PropTypes.func,
  editServer: PropTypes.func,
  formData: PropTypes.object,
  isEdit: PropTypes.bool,
  popsList: PropTypes.array,
}
