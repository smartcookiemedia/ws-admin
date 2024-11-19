import React, { useState, useEffect } from 'react'
import { useStore } from 'state'
import { Link } from 'react-router-dom'
import ItemTable from 'common/ItemTable'
import LoadingButton from 'common/LoadingButton'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Badge,
} from 'reactstrap'

function PaymentsSearchResults({ match, location }) {
  const { responseCallback } = useStore()
  const [payments, setPayments] = useState([])
  const [showWarning, setShowWarning] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState({})
  const [deleteProduct, setDeleteProduct] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortParam, setSortParam] = useState('sort=asc')
  const [submitting, setSubmitting] = useState(false)
  const tableHeaders = [
    { name: 'Transaction ID', sortable: true },
    { name: 'Email', sortable: false },
    { name: 'Subscription ID', sortable: false },
    { name: 'Fingerprint', sortable: false },
    { name: 'Amount', sortable: false },
    { name: '', sortable: false },
  ]
  const { params } = match
  const { search } = location

  useEffect(() => {
    const fetchPayments = async () => {
      const query = search.split('?')
      const payments = await responseCallback(
        'sendGet',
        `payments/${params.type}/${
          query[1]
        }?${sortParam}&page=${currentPage}&limit=50`,
      )
      payments.success && setPayments(payments.body.payments)
    }
    fetchPayments()
  }, [params.type, search, responseCallback, currentPage, sortParam])

  const toggleWarning = () => () => setShowWarning(!showWarning)

  const showWarningModal = ({ product_name, PK }) => {
    setPaymentInfo({ product_name, PK })
    setDeleteProduct(false)
    toggleWarning()()
  }

  const updatePayments = id => {
    const updatedPayments = payments.map(payment => {
      return payment.PK === id ? { ...payment, tx_status: 0 } : payment
    })
    setPayments(updatedPayments)
  }

  const refundPayment = async () => {
    setSubmitting(true)
    const url = deleteProduct
      ? `payments/${paymentInfo.PK}?remove_product=1`
      : `payments/${paymentInfo.PK}`
    const res = await responseCallback('deleteData', url)

    if (res.success) {
      toggleWarning()()
      updatePayments(paymentInfo.PK)
    }
  }

  return (
    <div className="animated fadeIn">
      <Modal
        isOpen={showWarning}
        toggle={toggleWarning()}
        className="modal-danger"
      >
        <ModalHeader toggle={toggleWarning()}>Refund Payment</ModalHeader>
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
              value="false"
              checked={!deleteProduct}
              onChange={() => {
                setDeleteProduct(false)
              }}
            />
            <Label check className="form-check-label" htmlFor="remove_product2">
              {`Keep Product: ${paymentInfo.product_name}`}
            </Label>
          </FormGroup>
          <FormGroup check className="radio">
            <Input
              className="form-check-input"
              type="radio"
              id="remove_product1"
              name="remove_product"
              value="true"
              checked={deleteProduct}
              onChange={() => {
                setDeleteProduct(true)
              }}
            />
            <Label check className="form-check-label" htmlFor="remove_product1">
              {`Remove Product: ${paymentInfo.product_name}`}
            </Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            color="danger"
            submitting={submitting}
            setSubmitting={setSubmitting}
            handleClick={refundPayment}
          >
            Confirm
          </LoadingButton>
          <Button color="primary" onClick={toggleWarning()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ItemTable
        cardHeader={`Payments for ${params.type}: ${search.split('?')[1]}`}
        tableHeaders={tableHeaders}
        pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSortParam={setSortParam}
        emptyTableMessage={'No Payments Found'}
      >
        {payments.map(payment => {
          return (
            <tr key={payment.PK}>
              <td>
                <Link to={`/payments/tx_id?${payment.tx_id}`}>
                  {payment.tx_id}
                </Link>
              </td>
              <td className="nowrap">
                <Link to={`/users/user/${payment.user.PK}`}>
                  <i className="fa fa-user-circle mr-2"></i>
                </Link>
                <Link
                  to={`/payments/user?${payment.user.PK}`}
                  className="url__link"
                >
                  {payment.user.email}
                </Link>
              </td>
              <td>
                <Link to={`/payments/sub_id?${payment.sub_id}`}>
                  {payment.sub_id}
                </Link>
              </td>
              <td>
                <Link to={`/payments/fingerprint?${payment.fingerprint}`}>
                  {payment.fingerprint}
                </Link>
              </td>
              <td>${payment.amount}</td>
              <td>
                {payment.tx_status === 1 ? (
                  <Button
                    onClick={() => showWarningModal(payment)}
                    color="danger"
                  >
                    Refund
                  </Button>
                ) : (
                  <Badge>Refunded</Badge>
                )}
              </td>
            </tr>
          )
        })}
      </ItemTable>
    </div>
  )
}
export default PaymentsSearchResults
