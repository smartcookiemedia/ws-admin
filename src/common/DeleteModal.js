import React, { useState } from 'react'
import PropTypes from 'prop-types'
import LoadingButton from 'common/LoadingButton'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

function DeleteModal({ showModal, toggleModal, deleteItem, headerMessage }) {
  const [submitting, setSubmitting] = useState()

  const submit = () => {
    setSubmitting(true)
    deleteItem()
  }

  return (
    <Modal isOpen={showModal} toggle={toggleModal} className="modal-danger">
      <ModalHeader>{headerMessage}</ModalHeader>
      <ModalBody>This action cannot be undone.</ModalBody>
      <ModalFooter>
        <LoadingButton
          onClick={submit}
          submitting={submitting}
          setSubmitting={setSubmitting}
          color="danger"
        >
          {submitting ? 'Submitting...' : 'Confirm'}
        </LoadingButton>
        <Button color="primary" onClick={() => toggleModal()}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DeleteModal

DeleteModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  deleteItem: PropTypes.func,
  headerMessage: PropTypes.string,
}
