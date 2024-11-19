import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
} from 'reactstrap'
import LoadingButton from 'common/LoadingButton'

export default function ItemModal({
  showModal,
  closeModal,
  isEdit,
  modalHeader,
  initialValues,
  validationSchema,
  editItem,
  createItem,
  children,
  size,
}) {
  const [noChanges, setNoChanges] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submitForm = values => {
    setSubmitting(true)
    createItem(values)
  }

  const editForm = data => {
    let changes = {}

    for (const key in initialValues) {
      if (initialValues[key] !== data[key]) {
        changes[key] = data[key]
      }
    }

    if (Object.keys(changes).length === 0) {
      setNoChanges(true)
      return
    }

    setSubmitting(true)
    if (changes.status) {
      changes = { ...changes, status: parseInt(changes.status) }
    }

    editItem(changes)
    setNoChanges(false)
  }

  const closeItemModal = () => {
    setNoChanges(false)
    closeModal()
  }

  return (
    <Modal
      isOpen={showModal}
      size={size || 'md'}
      toggle={() => closeModal()}
      className="modal-primary"
    >
      <ModalHeader>{modalHeader}</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={values => (isEdit ? editForm(values) : submitForm(values))}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form id="modalForm" onSubmit={handleSubmit}>
              {children({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
              })}
              {noChanges && (
                <FormFeedback style={{ display: 'inline-block' }}>
                  Nothing Changed
                </FormFeedback>
              )}
            </form>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <LoadingButton
          type="submit"
          form="modalForm"
          submitting={submitting}
          setSubmitting={setSubmitting}
        >
          {submitting ? 'Submitting...' : 'Confirm'}
        </LoadingButton>
        <Button color="danger" onClick={() => closeItemModal()}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ItemModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  createItem: PropTypes.func,
  editItem: PropTypes.func,
  isEdit: PropTypes.bool,
  modalHeader: PropTypes.string,
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object,
}
