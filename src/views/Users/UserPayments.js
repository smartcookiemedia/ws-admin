import React, { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input,
  Badge,
} from 'reactstrap'
import ItemTable from 'common/ItemTable'
import { useStore } from 'state'
import UserTabController from './UsersTabController'
import LoadingButton from 'common/LoadingButton'

function UserPayments(props) {
  const { responseCallback, setAlert } = useStore()
  const {
    match: { params },
  } = props

  const [submitting, setSubmitting] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(0)
  const [payments, setPayments] = useState([])
  const [subId, setSubId] = useState(null)
  const [warning, setWarning] = useState(false)
  const tableHeaders = [
    { name: 'Product', sortable: false },
    { name: 'Product Type', sortable: false },
    { name: 'Date', sortable: false },
    { name: 'Method', sortable: false },
    { name: 'Transaction ID', sortable: false },
    { name: 'Price Point', sortable: false },
    { name: 'Amount', sortable: false },
    { name: 'Refund', sortable: false },
  ]

  useEffect(() => {
    const fetchPayments = async () => {
      const payments = await responseCallback(
        'sendGet',
        `payments/user/${params.userId}`,
      )
      payments.success && setPayments(payments.body.payments)
    }
    fetchPayments()

    return () => setAlert({ showAlert: false, message: '', isSuccess: false })
  }, [params.userId, responseCallback, setAlert])

  const updatePayments = id => {
    const updatedPayments = payments.map(payment => {
      return payment.PK === id ? { ...payment, tx_status: 0 } : payment
    })
    setPayments(updatedPayments)
  }

  const deleteRecord = async () => {
    setSubmitting(true)
    const endpoint = deleteProduct
      ? `payments/${subId}?remove_product=1`
      : `payments/${subId}`

    const deleteRecord = await responseCallback('sendDelete', endpoint)

    if (deleteRecord.success) {
      updatePayments(subId)
    }
    toggleWarning()
  }

  const toggleWarning = () => {
    setWarning(!warning)
  }

  const renderButton = payment => {
    if (payment.tx_status === 0) {
      return (
        <div>
          <Badge color="success">Refunded</Badge>
        </div>
      )
    } else {
      return (
        <Button
          color="danger"
          className="px-4"
          onClick={() => {
            toggleWarning()
            setSubId(payment.PK)
          }}
        >
          Refund
        </Button>
      )
    }
  }

  return (
    <div className="animated fadeIn">
      <UserTabController {...props} />
      <ItemTable cardHeader={'Payments'} tableHeaders={tableHeaders}>
        {payments.map((payment, index) => {
          return (
            <tr key={index}>
              <td>{payment.product_name}</td>
              <td>{payment.product_type}</td>
              <td>{payment.date}</td>
              <td>{payment.method}</td>
              <td>{payment.tx_id}</td>
              <td>{payment.price_point}</td>
              <td>${payment.amount}</td>
              <td>{renderButton(payment)}</td>
            </tr>
          )
        })}
      </ItemTable>

      <Modal isOpen={warning} toggle={toggleWarning} className="modal-danger">
        <ModalHeader toggle={toggleWarning}>Refund this payment?</ModalHeader>
        <ModalBody>
          <h5>
            <em>Optionally Remove Product?</em>
          </h5>
          <FormGroup check className="radio">
            <Input
              className="form-check-input"
              type="radio"
              id="remove_product2"
              name="remove_product"
              value="0"
              checked
              onChange={() => {
                setDeleteProduct(0)
              }}
            />
            <Label check className="form-check-label" htmlFor="remove_product2">
              Keep Product
            </Label>
          </FormGroup>
          <FormGroup check className="radio">
            <Input
              className="form-check-input"
              type="radio"
              id="remove_product1"
              name="remove_product"
              value="1"
              onChange={() => {
                setDeleteProduct(1)
              }}
            />
            <Label check className="form-check-label" htmlFor="remove_product1">
              Remove Product
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            color="danger"
            submitting={submitting}
            setSubmitting={setSubmitting}
            handleClick={deleteRecord}
          >
            Confirm
          </LoadingButton>
          <Button color="primary" onClick={toggleWarning}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default UserPayments
