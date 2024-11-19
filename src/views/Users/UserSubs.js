import React, { useState, useEffect } from 'react'
import { Button, Badge } from 'reactstrap'
import ItemTable from 'common/ItemTable'
import { useStore } from 'state'
import * as moment from 'moment'
import ReactTooltip from 'react-tooltip'
import DeleteModal from 'common/DeleteModal'

function UserSubs(props) {
  const { responseCallback, setAlert } = useStore()
  const {
    match: { params },
  } = props

  const [subscriptions, setSubscriptions] = useState([])
  const [subId, setSubId] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const tableHeaders = [
    { name: 'Product', sortable: false },
    { name: 'Product Type', sortable: false },
    { name: 'Method', sortable: false },
    { name: 'Amount', sortable: false },
    { name: 'Started', sortable: false },
    { name: 'Ended', sortable: false },
    { name: 'Cancel Subscription', sortable: false },
  ]

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const subscriptions = await responseCallback(
        'sendGet',
        `subscriptions/user/${params.userId}`,
      )
      subscriptions.success &&
        setSubscriptions(subscriptions.body.subscriptions)
    }
    fetchSubscriptions()

    return () =>
      setAlert({
        showAlert: false,
        message: '',
        isSuccess: false,
      })
  }, [params.userId, responseCallback, setAlert])

  const deleteRecord = async () => {
    const deletedRecord = await responseCallback(
      'sendDelete',
      `subscriptions/${subId}`,
    )

    if (deletedRecord.success) {
      const updatedSubscriptions = subscriptions.map(subscription => {
        if (subscription.PK === subId) {
          subscription.status = 0
          subscription.ended = moment(new Date()).format('YYYY-MM-DD')
        }
        return subscription
      })
      setSubscriptions(updatedSubscriptions)
    }
    toggleWarning()()
  }

  const toggleWarning = () => () => setShowWarning(!showWarning)

  const showWarningModal = id => {
    setSubId(id)
    toggleWarning()()
  }

  const CancelButton = ({ status, id }) => {
    if (status === 0) {
      return <Badge color="secondary">Cancelled</Badge>
    } else {
      return (
        <Button
          color="danger"
          className="px-4"
          onClick={() => showWarningModal(id)}
        >
          Cancel
        </Button>
      )
    }
  }

  return (
    <div className="animated fadeIn">
      <ItemTable cardHeader={'Subscription'} tableHeaders={tableHeaders}>
        {subscriptions.map((subscription, index) => {
          return (
            <tr key={index}>
              <td>{subscription.product_name}</td>
              <td>{subscription.product_type}</td>
              <td>{subscription.method}</td>
              <td>${subscription.amount}</td>
              <td>{subscription.started}</td>
              <td>{subscription.ended}</td>
              <td>
                <CancelButton
                  status={subscription.status}
                  id={subscription.PK}
                />
                {subscription.cancel_reason && (
                  <div className="tip">
                    <i
                      className="icon-info icons d-block ml-2"
                      data-tip
                      data-for={subscription.PK}
                    ></i>
                    <ReactTooltip id={subscription.PK}>
                      <span>{subscription.cancel_reason}</span>
                    </ReactTooltip>
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </ItemTable>
      <DeleteModal
        showModal={showWarning}
        toggleModal={toggleWarning()}
        deleteItem={deleteRecord}
        headerMessage={'Are you sure you want to refund this Subscription?'}
      />
    </div>
  )
}

export default UserSubs
