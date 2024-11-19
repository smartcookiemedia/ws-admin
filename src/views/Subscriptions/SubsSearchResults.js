import React, { useState, useEffect, Fragment } from 'react'
import { useStore } from 'state'
import DeleteModal from 'common/DeleteModal'
import { Button, Badge } from 'reactstrap'
import { Link } from 'react-router-dom'
import ItemTable from 'common/ItemTable'
import * as moment from 'moment'
import ReactTooltip from 'react-tooltip'

function SubsSearchResults(props) {
  const { responseCallback, setAlert } = useStore()
  const [subscriptions, setSubscriptions] = useState([])
  const [showDeleteModal, setShowDeleteModel] = useState(false)
  const [subId, setSubId] = useState('')
  const [term, setTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortParam, setSortParam] = useState('sort=asc&')

  const {
    match: { params },
  } = props
  const {
    location: { search },
  } = props

  const tableHeaders = [
    { name: 'Subscription ID', sortable: true },
    { name: 'Email', sortable: false },
    { name: 'Product', sortable: false },
    { name: 'Product Type', sortable: false },
    { name: 'Amount', sortable: false },
    { name: 'Started', sortable: false },
    { name: 'Ended', sortable: false },
    { name: '', sortable: false },
  ]

  useEffect(() => {
    const fetchSubs = async () => {
      const termsearch = search.split('?')[1]
      setTerm(termsearch)

      let endpoint =
        params.type === 'sub_id'
          ? `subscriptions/${termsearch}`
          : `subscriptions/${params.type}/${termsearch}`

      endpoint += `?${sortParam}page=${currentPage}&limit=50`

      const res = await responseCallback('sendGet', endpoint)
      res.success && setSubscriptions(res.body.subscriptions)
      res.error && setSubscriptions([])
    }
    fetchSubs()
  }, [currentPage, params.type, responseCallback, search, sortParam])

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
      setAlert({
        showAlert: true,
        message: 'Subscription cancelled',
        isSuccess: true,
      })
    }
    toggleDeleteModal()
  }

  const toggleDeleteModal = id => {
    id && setSubId(id)
    setShowDeleteModel(!showDeleteModal)
  }

  const CancelButton = ({ status, id }) => {
    if (!status) {
      return <Badge color="secondary">Cancelled</Badge>
    } else {
      return (
        <Button color="danger" onClick={() => toggleDeleteModal(id)}>
          Cancel
        </Button>
      )
    }
  }

  return (
    <div className="animated fadeIn">
      <DeleteModal
        showModal={showDeleteModal}
        toggleModal={toggleDeleteModal}
        deleteItem={deleteRecord}
        headerMessage={'Are you sure you want to refund this Subscription?'}
      />
      <ItemTable
        cardHeader={
          <Fragment>
            Subscriptions for{' '}
            <strong>
              {params.type}: {term}
            </strong>
          </Fragment>
        }
        emptyTableMessage={'No Subscriptions Found'}
        tableHeaders={tableHeaders}
        pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSortParam={setSortParam}
      >
        {subscriptions.map(subscription => {
          return (
            <tr key={subscription.PK}>
              <td>
                <Link to={`/subscriptions/sub_id?${subscription.PK}`}>
                  {subscription.PK}
                </Link>
              </td>
              <td className="nowrap">
                <Link to={`/users/user/${subscription.user.PK}`}>
                  <i className="fa fa-user-circle mr-2"></i>
                </Link>
                <Link
                  to={`/subscriptions/user?${subscription.user.PK}`}
                  className="url__link"
                >
                  {subscription.user.email}
                </Link>
              </td>
              <td>{subscription.product_name}</td>
              <td>{subscription.product_type}</td>
              <td>${subscription.amount || 0}</td>
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
    </div>
  )
}
export default SubsSearchResults
